import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

export default function Insights({ expenses, budget }) {
  const now = new Date();

  const getStartOfWeek = () => {
    const d = new Date();
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const startOfWeek = getStartOfWeek();

  const getStartOfLastWeek = () => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() - 7);
    return d;
  };

  const startOfLastWeek = getStartOfLastWeek();

  const isThisWeek = (date) => {
    const d = new Date(date);
    return d >= startOfWeek;
  };

  const isLastWeek = (date) => {
    const d = new Date(date);
    return d >= startOfLastWeek && d < startOfWeek;
  };

  const isToday = (date) => {
    const d = new Date(date);
    return d.toDateString() === now.toDateString();
  };

  const todayTotal = expenses
    .filter((e) => isToday(e.timestamp))
    .reduce((sum, e) => sum + e.amount, 0);

  const thisWeek = expenses.filter((e) => isThisWeek(e.timestamp));
  const weekTotal = thisWeek.reduce((sum, e) => sum + e.amount, 0);

  const lastWeek = expenses.filter((e) => isLastWeek(e.timestamp));
  const lastWeekTotal = lastWeek.reduce((sum, e) => sum + e.amount, 0);

  let percentChange = 0;
  let difference = weekTotal - lastWeekTotal;

  if (lastWeekTotal > 0) {
    percentChange = (difference / lastWeekTotal) * 100;
  }

  const formattedPercent = Math.abs(percentChange).toFixed(0);
  const formattedDiff = Math.abs(difference);

  const avgPerDay = Math.round(weekTotal / 7);

  const highest =
    thisWeek.length > 0
      ? Math.max(...thisWeek.map((e) => e.amount))
      : 0;

  // Budget
  const remaining = budget - weekTotal;

  const daysPassed = Math.max(
    1,
    Math.ceil((now - startOfWeek) / (1000 * 60 * 60 * 24))
  );

  const avgSpend = weekTotal / daysPassed;

  let daysLeft = 0;
  if (avgSpend > 0 && remaining > 0) {
    daysLeft = Math.floor(remaining / avgSpend);
  }

  // Top Day
  const dayTotals = {};
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  thisWeek.forEach((e) => {
    const d = new Date(e.timestamp);
    const day = days[d.getDay()];
    if (!dayTotals[day]) dayTotals[day] = 0;
    dayTotals[day] += e.amount;
  });

  let topDay = null;
  let topDayAmount = 0;

  Object.entries(dayTotals).forEach(([day, total]) => {
    if (total > topDayAmount) {
      topDay = day;
      topDayAmount = total;
    }
  });

  // Peak Hour
  const hourTotals = {};
  thisWeek.forEach((e) => {
    const d = new Date(e.timestamp);
    const hour = d.getHours();
    if (!hourTotals[hour]) hourTotals[hour] = 0;
    hourTotals[hour] += e.amount;
  });

  let peakHour = null;
  let peakAmount = 0;

  Object.entries(hourTotals).forEach(([hour, total]) => {
    if (total > peakAmount) {
      peakHour = Number(hour);
      peakAmount = total;
    }
  });

  const formatHour = (h) => {
    if (h === null) return "";
    const start = h % 12 === 0 ? 12 : h % 12;
    const end = (h + 1) % 12 === 0 ? 12 : (h + 1) % 12;
    const suffix = h >= 12 ? "PM" : "AM";
    return `${start}–${end} ${suffix}`;
  };

  // Last 7 days chart
  const last7Data = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);

    const total = expenses
      .filter((e) => {
        const ed = new Date(e.timestamp);
        return ed.toDateString() === d.toDateString();
      })
      .reduce((sum, e) => sum + e.amount, 0);

    last7Data.push({
      name: days[d.getDay()],
      amount: total,
    });
  }

  // Category Pie
  const categoryTotals = {};
  expenses.forEach((e) => {
    const cat = e.category || "Other";
    if (!categoryTotals[cat]) categoryTotals[cat] = 0;
    categoryTotals[cat] += e.amount;
  });

  const categoryData = Object.entries(categoryTotals)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);

  const totalSum = categoryData.reduce((sum, c) => sum + c.total, 0);

  const COLORS = [
    "#3b82f6",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#a855f7",
    "#14b8a6",
  ];

  const yMax =
    highest === 0
      ? 100
      : Math.ceil((highest + 20) / 50) * 50;

  const ticks = [];
  for (let i = 0; i <= yMax; i += 50) ticks.push(i);

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-xl font-semibold">Insights</h1>

      {/* Week Comparison */}
      <div className="bg-zinc-900 p-4 rounded-2xl">
        {lastWeekTotal === 0 ? (
          <p className="text-sm text-zinc-500">No data last week</p>
        ) : (
          <p
            className={`text-lg font-semibold ${
              percentChange > 0 ? "text-red-500" : "text-green-500"
            }`}
          >
            {percentChange > 0 ? "↑" : "↓"} {formattedPercent}%{" "}
            <span className="text-sm text-zinc-400">
              (₹{formattedDiff} {percentChange > 0 ? "more" : "less"})
            </span>
          </p>
        )}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900 p-4 rounded-2xl">
          <p className="text-sm text-zinc-400">Today</p>
          <p className="text-xl font-semibold">₹{todayTotal}</p>
        </div>

        <div className="bg-zinc-900 p-4 rounded-2xl">
          <p className="text-sm text-zinc-400">This Week</p>
          <p className="text-xl font-semibold">₹{weekTotal}</p>
        </div>

        <div className="bg-zinc-900 p-4 rounded-2xl">
          <p className="text-sm text-zinc-400">Avg / Day</p>
          <p className="text-xl font-semibold">₹{avgPerDay}</p>
        </div>

        <div className="bg-zinc-900 p-4 rounded-2xl">
          <p className="text-sm text-zinc-400">Highest</p>
          <p className="text-xl font-semibold">₹{highest}</p>
        </div>
      </div>

      {/* Budget */}
      <div className="bg-zinc-900 p-4 rounded-2xl">
        <p className="text-sm text-zinc-300">
          ₹{remaining > 0 ? remaining : 0} left this week
        </p>
        <p className="text-xs text-zinc-400">
          {remaining <= 0
            ? "Budget exhausted"
            : avgSpend > 0
            ? `${daysLeft} days left`
            : "No spending yet"}
        </p>
      </div>

      {/* Behavior */}
      <div className="bg-zinc-900 p-4 rounded-2xl space-y-2">
        {topDay && (
          <p className="text-sm text-zinc-300">
            Spent most on {topDay} (₹{topDayAmount})
          </p>
        )}
        {peakHour !== null && (
          <p className="text-sm text-zinc-300">
            Usually spent around {formatHour(peakHour)}
          </p>
        )}
      </div>

      {/* Line Chart FIXED */}
      <div className="bg-zinc-900 p-4 rounded-2xl">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={last7Data}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <XAxis dataKey="name" stroke="#888" interval={0} />
            <YAxis
              stroke="#888"
              domain={[0, yMax]}
              ticks={ticks}
              allowDecimals={false}
            />
            <Tooltip />
            <Line
              type="linear"
              dataKey="amount"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie */}
      <div className="bg-zinc-900 p-4 rounded-2xl space-y-4">
        <div className="flex justify-center">
          <PieChart width={220} height={220}>
            <Pie
              data={categoryData}
              dataKey="total"
              cx="50%"
              cy="50%"
              outerRadius={80}
            >
              {categoryData.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </div>

        <div className="space-y-2">
          {categoryData.map((item, index) => {
            const percent = totalSum
              ? ((item.total / totalSum) * 100).toFixed(0)
              : 0;

            return (
              <div
                key={item.category}
                className="flex justify-between text-sm"
              >
                <div className="flex gap-2 items-center">
                  <div
                    className="w-3 h-3"
                    style={{
                      backgroundColor:
                        COLORS[index % COLORS.length],
                    }}
                  />
                  {item.category}
                </div>
                <div className="text-zinc-400">
                  {percent}% • ₹{item.total}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}