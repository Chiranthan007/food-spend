import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Insights({ expenses }) {
  const now = new Date();

  // ---- Helpers ----
  const isToday = (date) => {
    const d = new Date(date);
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  };

  const isLast7Days = (date) => {
    const d = new Date(date);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 6); // include today (7 total days)
    return d >= sevenDaysAgo && d <= now;
  };

  // ---- Filtered data ----
  const todayExpenses = expenses.filter((e) => isToday(e.timestamp));
  const last7Expenses = expenses.filter((e) =>
    isLast7Days(e.timestamp)
  );

  // ---- Stats ----
  const todayTotal = todayExpenses.reduce((sum, e) => sum + e.amount, 0);
  const last7Total = last7Expenses.reduce((sum, e) => sum + e.amount, 0);

  const avgPerDay =
    last7Expenses.length === 0
      ? 0
      : Math.round(last7Total / 7);

  const highestExpense =
    expenses.length === 0
      ? 0
      : Math.max(...expenses.map((e) => e.amount));

  // ---- Build chart data (last 7 days) ----
  const getLast7DaysData = () => {
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);

      const label = date.toLocaleDateString("en-IN", {
        weekday: "short",
      });

      const total = expenses
        .filter((e) => {
          const d = new Date(e.timestamp);
          return (
            d.getDate() === date.getDate() &&
            d.getMonth() === date.getMonth() &&
            d.getFullYear() === date.getFullYear()
          );
        })
        .reduce((sum, e) => sum + e.amount, 0);

      days.push({
        day: label,
        amount: total,
      });
    }

    return days;
  };

  const chartData = getLast7DaysData();

  // ---- UI ----
  return (
    <div className="pb-20 space-y-4">
      <h1 className="text-xl font-semibold">Insights</h1>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-zinc-900 p-4 rounded-2xl">
          <p className="text-xs text-zinc-400">Today</p>
          <p className="text-lg font-semibold">₹{todayTotal}</p>
        </div>

        <div className="bg-zinc-900 p-4 rounded-2xl">
          <p className="text-xs text-zinc-400">Last 7 Days</p>
          <p className="text-lg font-semibold">₹{last7Total}</p>
        </div>

        <div className="bg-zinc-900 p-4 rounded-2xl">
          <p className="text-xs text-zinc-400">Avg / Day</p>
          <p className="text-lg font-semibold">₹{avgPerDay}</p>
        </div>

        <div className="bg-zinc-900 p-4 rounded-2xl">
          <p className="text-xs text-zinc-400">Highest</p>
          <p className="text-lg font-semibold">₹{highestExpense}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-zinc-900 p-4 rounded-2xl">
        <p className="text-sm text-zinc-400 mb-3">Last 7 Days Trend</p>

        <div style={{ width: "100%", height: 200 }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <XAxis dataKey="day" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#3b82f6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Empty state */}
      {expenses.length === 0 && (
        <div className="text-sm text-zinc-500">
          Add some expenses to see insights
        </div>
      )}
    </div>
  );
}