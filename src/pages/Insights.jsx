import { useMemo } from "react";
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

import { getInsightsData } from "../utils/calculations";

export default function Insights({ expenses, budget }) {
  const {
    todayTotal,
    weekTotal,
    lastWeekTotal,
    difference,
    percentChange,
    last7Data,
    categoryData,
    totalSum,
    smallSpendTotal,
    smallSpendCount,
    smallSpends,
    burnRate,
  } = useMemo(() => {
    return getInsightsData(expenses);
  }, [expenses]);

  const formattedPercent = Math.abs(percentChange).toFixed(0);
  const formattedDiff = Math.abs(difference);

  const highest =
    last7Data.length > 0
      ? Math.max(...last7Data.map((d) => d.amount))
      : 0;

  const remaining = Math.max(0, budget - weekTotal);

  // 🧠 Week context (Mon → Sun)
  const today = new Date().getDay(); // 0 = Sun, 6 = Sat
  const remainingDays = today === 0 ? 0 : 7 - today;

  // 🧠 Burn prediction
  let daysToExhaust = null;
  if (burnRate > 0) {
    daysToExhaust = Math.floor(remaining / burnRate);
  }

  // 🧠 % used
  const percentUsed =
    budget > 0 ? (weekTotal / budget) * 100 : 0;

  // 🧠 Message logic (tone upgrade)
  let budgetMessage = "";

  if (budget === 0) {
    budgetMessage = "";
  } else if (remaining <= 0) {
    budgetMessage = "Budget exhausted";
  } else if (
    daysToExhaust !== null &&
    daysToExhaust < remainingDays
  ) {
    budgetMessage = `Will run out in ${daysToExhaust} day${
      daysToExhaust === 1 ? "" : "s"
    }`;
  } else if (percentUsed > 75) {
    budgetMessage = "Getting close to your limit";
  } else {
    budgetMessage = "On track for this week";
  }

  // 🎨 subtle color feedback
  const getBudgetColor = () => {
    if (remaining <= 0) return "text-red-500";
    if (
      daysToExhaust !== null &&
      daysToExhaust < remainingDays
    )
      return "text-red-400";
    if (percentUsed > 75) return "text-yellow-400";
    return "text-green-400";
  };

  const COLORS = [
    "#3b82f6",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#a855f7",
    "#14b8a6",
  ];

  const step = 50;
  const yMax =
    highest === 0
      ? 100
      : Math.ceil(highest / step) * step;

  const ticks = [];
  for (let i = 0; i <= yMax; i += step) ticks.push(i);

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-xl font-semibold">Insights</h1>

      {/* Comparison */}
      <div className="bg-zinc-900 p-4 rounded-2xl">
        {lastWeekTotal === 0 ? (
          <p className="text-sm text-zinc-500">
            No data last week
          </p>
        ) : (
          <p
            className={`text-lg font-semibold ${
              percentChange > 0
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            {percentChange > 0 ? "↑" : "↓"}{" "}
            {formattedPercent}%{" "}
            <span className="text-sm text-zinc-400">
              (₹{formattedDiff}{" "}
              {percentChange > 0 ? "more" : "less"})
            </span>
          </p>
        )}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900 p-4 rounded-2xl">
          <p className="text-sm text-zinc-400">Today</p>
          <p className="text-xl font-semibold">
            ₹{todayTotal}
          </p>
        </div>

        <div className="bg-zinc-900 p-4 rounded-2xl">
          <p className="text-sm text-zinc-400">
            This Week
          </p>
          <p className="text-xl font-semibold">
            ₹{weekTotal}
          </p>
        </div>
      </div>

      {/* 💰 Budget (now expressive) */}
      <div className="bg-zinc-900 p-4 rounded-2xl space-y-1">
        <p className="text-sm text-zinc-300">
          ₹{remaining} left this week
        </p>

        {budget > 0 && (
          <p className={`text-xs ${getBudgetColor()}`}>
            {budgetMessage}
          </p>
        )}
      </div>

      {/* 🧠 Small spends */}
      <div className="bg-zinc-900 p-4 rounded-2xl space-y-3">
        {smallSpendCount > 0 ? (
          <>
            <p className="text-sm text-zinc-400">
              Small spends
            </p>

            <p className="text-lg font-semibold">
              ₹{smallSpendTotal}
            </p>

            <div className="space-y-2">
              {smallSpends.slice(0, 3).map((e) => (
                <div
                  key={e.id}
                  className="flex justify-between text-sm"
                >
                  <div>
                    <p>
                      {e.note || e.category} •{" "}
                      {new Date(
                        e.timestamp
                      ).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <p>₹{e.amount}</p>
                </div>
              ))}
            </div>

            <p className="text-xs text-zinc-500">
              from {smallSpendCount} easy-to-miss{" "}
              {smallSpendCount === 1
                ? "transaction"
                : "transactions"}
            </p>
          </>
        ) : (
          <p className="text-sm text-zinc-500">
            No small spends this week
          </p>
        )}
      </div>

      {/* 📈 Line Chart */}
      <div className="bg-zinc-900 p-4 rounded-2xl">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={last7Data}>
            <XAxis dataKey="name" stroke="#888" />
            <YAxis
              stroke="#888"
              domain={[0, yMax]}
              ticks={ticks}
            />
            <Tooltip />
            <Line
              dataKey="amount"
              stroke="#3b82f6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 🥧 Pie */}
      <div className="bg-zinc-900 p-4 rounded-2xl space-y-4">
        <div className="flex justify-center">
          <PieChart width={220} height={220}>
            <Pie
              data={categoryData}
              dataKey="total"
              outerRadius={80}
            >
              {categoryData.map((_, i) => (
                <Cell
                  key={i}
                  fill={COLORS[i % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </div>

        {categoryData.map((item, i) => {
          const percent = totalSum
            ? (
                (item.total / totalSum) *
                100
              ).toFixed(0)
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
                      COLORS[i % COLORS.length],
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
  );
}