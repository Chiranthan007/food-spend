import { useState, useMemo } from "react";
import QuickAdd from "../components/QuickAdd";
import { getBasicTotals } from "../utils/calculations";

export default function Home({ expenses, onAdd, budget, setBudget }) {

  // ⚡ Memoized totals
  const { todayTotal, weekTotal } = useMemo(() => {
    return getBasicTotals(expenses);
  }, [expenses]);

  // 💰 Budget calculations
  const spent = weekTotal;
  const remaining = Math.max(0, budget - weekTotal);
  const percent =
    budget > 0
      ? Math.min(100, Math.round((spent / budget) * 100))
      : 0;

  // 🎨 Dynamic color
  const getBarColor = () => {
    if (percent < 50) return "bg-green-500";
    if (percent < 80) return "bg-yellow-400";
    return "bg-red-500";
  };

  // ✏️ Edit mode
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState(budget);

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-xl font-semibold">Home</h1>

      {/* ➕ Quick Add */}
      <QuickAdd onAdd={onAdd} />

      {/* 💰 Budget */}
      <div className="bg-zinc-900 p-4 rounded-2xl space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-sm text-zinc-400">Weekly Budget</p>

          {!isEditingBudget && (
            <button
              onClick={() => {
                setTempBudget(budget);
                setIsEditingBudget(true);
              }}
              className="text-sm text-blue-500"
            >
              Edit
            </button>
          )}
        </div>

        {isEditingBudget ? (
          <input
            type="number"
            value={tempBudget}
            onChange={(e) => setTempBudget(e.target.value)}
            onBlur={() => {
              setBudget(Number(tempBudget));
              setIsEditingBudget(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setBudget(Number(tempBudget));
                setIsEditingBudget(false);
              }
            }}
            autoFocus
            className="text-2xl font-semibold bg-transparent outline-none w-full"
          />
        ) : (
          <p className="text-2xl font-semibold">
            ₹{budget || 0}
          </p>
        )}

        <p className="text-sm text-zinc-300">
          ₹{spent} spent • ₹{remaining} left
        </p>

        <div className="flex items-center gap-2">
          <div className="flex-1 bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div
              className={`${getBarColor()} h-full transition-all`}
              style={{ width: `${percent}%` }}
            />
          </div>

          <span className="text-xs text-zinc-400">
            {percent}%
          </span>
        </div>
      </div>

      {/* 📅 Today */}
      <div className="bg-zinc-900 p-4 rounded-2xl">
        <p className="text-sm text-zinc-400">Today</p>
        <p className="text-xl font-semibold">₹{todayTotal}</p>
      </div>

      {/* 🧾 Recent */}
      <div className="bg-zinc-900 p-4 rounded-2xl">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-zinc-400">Recent</p>
        </div>

        {expenses.length === 0 ? (
          <p className="text-sm text-zinc-500">
            No expenses yet
          </p>
        ) : (
          <div className="space-y-2">
            {expenses.slice(0, 5).map((e) => (
              <div
                key={e.id}
                className="flex justify-between text-sm"
              >
                <div>
                  <p>{e.note || e.category}</p>
                  <p className="text-xs text-zinc-500">
                    {new Date(e.timestamp).toLocaleString()}
                  </p>
                </div>

                <p>₹{e.amount}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}