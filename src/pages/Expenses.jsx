import { useState } from "react";

export default function Expenses({ expenses, onDelete, onUpdate }) {
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const now = new Date();

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
    const diff = (now - d) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  };

  const filteredExpenses = expenses.filter((e) => {
    if (filter === "today") return isToday(e.timestamp);
    if (filter === "week") return isLast7Days(e.timestamp);
    return true;
  });

  const handleSave = (id) => {
    const val = Number(editValue);
    if (!val) return;
    onUpdate(id, val);
    setEditingId(null);
    setEditValue("");
  };

  return (
    <div className="space-y-4 pb-20">

      <h1 className="text-xl font-semibold">All Expenses</h1>

      {/* Filters */}
      <div className="flex gap-2">
        {["all", "today", "week"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-lg text-sm ${
              filter === f
                ? "bg-blue-600"
                : "bg-zinc-800 text-zinc-400"
            }`}
          >
            {f === "all" ? "All" : f === "today" ? "Today" : "Last 7 Days"}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-zinc-900 rounded-2xl divide-y divide-zinc-800">
        {filteredExpenses.length === 0 ? (
          <div className="p-4 text-sm text-zinc-500">
            No expenses found
          </div>
        ) : (
          filteredExpenses.map((e) => (
            <div
              key={e.id}
              className="flex justify-between items-center px-4 py-3"
            >

              {/* Left side */}
              {editingId === e.id ? (
                <input
                  type="number"
                  value={editValue}
                  onChange={(ev) => setEditValue(ev.target.value)}
                  className="bg-zinc-800 px-2 py-1 rounded text-sm w-24"
                />
              ) : (
                <div>
                  <p>₹{e.amount}</p>
                  <p className="text-xs text-zinc-400">
                    {new Date(e.timestamp).toLocaleString()}
                  </p>
                </div>
              )}

              {/* Right side */}
              <div className="flex gap-3 text-xs">

                {editingId === e.id ? (
                  <>
                    <button
                      onClick={() => handleSave(e.id)}
                      className="text-green-500"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-zinc-400"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditingId(e.id);
                        setEditValue(e.amount);
                      }}
                      className="text-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(e.id)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  </>
                )}

              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}