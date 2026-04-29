import { useState } from "react";
import QuickAdd from "../components/QuickAdd";
import { Link } from "react-router-dom";

export default function Home({ expenses, onAdd, budget, setBudget }) {
  const [input, setInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const now = new Date();

  // 🗓️ Start of week (Monday)
  const getStartOfWeek = () => {
    const d = new Date();
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const startOfWeek = getStartOfWeek();

  const isThisWeek = (date) => {
    const d = new Date(date);
    return d >= startOfWeek;
  };

  const isToday = (date) => {
    const d = new Date(date);
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  };

  // 📊 totals
  const weekTotal = expenses
    .filter((e) => isThisWeek(e.timestamp))
    .reduce((sum, e) => sum + e.amount, 0);

  const todayTotal = expenses
    .filter((e) => isToday(e.timestamp))
    .reduce((sum, e) => sum + e.amount, 0);

  const remaining = budget - weekTotal;

  // 🧠 percentage logic
  const percentUsed = budget > 0 ? Math.min((weekTotal / budget) * 100, 100) : 0;

  const getColor = () => {
    if (percentUsed < 60) return "bg-green-500";
    if (percentUsed < 90) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleSetBudget = () => {
    const val = Number(input);
    if (!val) return;
    setBudget(val);
    setInput("");
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 pb-20">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Food Spend</h1>
        <div className="text-xs text-zinc-400">
          {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Quick Add */}
      <QuickAdd onAdd={onAdd} />

      {/* 💰 Weekly Budget */}
      <div className="bg-zinc-900 p-4 rounded-2xl space-y-3">
        <p className="text-sm text-zinc-400">Weekly Budget</p>

        {budget === 0 || isEditing ? (
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Enter weekly budget"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-zinc-800 rounded-lg px-3 py-2 text-sm outline-none"
            />
            <button
              onClick={handleSetBudget}
              className="bg-blue-600 px-4 rounded-lg text-sm"
            >
              {budget === 0 ? "Set" : "Update"}
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold">₹{budget}</p>
                <p
                  className={`text-sm ${
                    remaining >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {remaining >= 0
                    ? `₹${remaining} left`
                    : `Over by ₹${Math.abs(remaining)}`}
                  {" • "}
                  {Math.round(percentUsed)}% used
                </p>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="text-xs text-blue-500"
              >
                Edit
              </button>
            </div>

            {/* 📊 Progress Bar */}
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${getColor()}`}
                style={{ width: `${percentUsed}%` }}
              />
            </div>
          </>
        )}
      </div>

      {/* 📊 This Week */}
      <div className="bg-zinc-800 p-4 rounded-2xl">
        <p className="text-sm text-zinc-400 mb-1">This Week</p>
        <p className="text-2xl font-semibold">₹{weekTotal}</p>
      </div>

      {/* 📅 Today */}
      <div className="bg-zinc-800 p-4 rounded-2xl">
        <p className="text-sm text-zinc-400 mb-1">Today</p>
        <p className="text-2xl font-semibold">₹{todayTotal}</p>
      </div>

      {/* Recent Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-sm text-zinc-400">Recent</h2>
        <Link to="/expenses" className="text-xs text-blue-500">
          View All
        </Link>
      </div>

      {/* Recent List */}
      <div className="bg-zinc-900 rounded-2xl divide-y divide-zinc-800">
        {expenses.length === 0 ? (
          <div className="p-4 text-sm text-zinc-500">
            No expenses yet
          </div>
        ) : (
          expenses.slice(0, 5).map((e) => (
            <div key={e.id} className="flex justify-between px-4 py-3">
              <div>
                <p>₹{e.amount}</p>
                <p className="text-xs text-zinc-400">
                  {e.note || "No note"} • {e.category}
                </p>
              </div>

              <span className="text-xs text-zinc-400">
                {new Date(e.timestamp).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))
        )}
      </div>

    </div>
  );
}