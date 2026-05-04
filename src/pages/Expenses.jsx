import { useState, useMemo } from "react";
import { CATEGORIES } from "../constants/categories";

export default function Expenses({ expenses, onDelete, onUpdate }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const [editData, setEditData] = useState({
    amount: "",
    note: "",
    category: "Other",
  });

  // 🧠 Filter
  const filteredExpenses =
    selectedCategory === "All"
      ? expenses
      : expenses.filter((e) => e.category === selectedCategory);

  // 🧠 Grouping
  const groupedExpenses = useMemo(() => {
    const groups = {};
    const now = new Date();

    filteredExpenses.forEach((e) => {
      const date = new Date(e.timestamp);

      const isToday =
        date.toDateString() === now.toDateString();

      const yesterday = new Date();
      yesterday.setDate(now.getDate() - 1);

      const isYesterday =
        date.toDateString() === yesterday.toDateString();

      let label;

      if (isToday) label = "Today";
      else if (isYesterday) label = "Yesterday";
      else {
        label = date.toLocaleDateString(undefined, {
          day: "numeric",
          month: "short",
        });
      }

      if (!groups[label]) groups[label] = [];
      groups[label].push(e);
    });

    return groups;
  }, [filteredExpenses]);

  const startEdit = (e) => {
    setEditingId(e.id);
    setEditData({
      amount: e.amount,
      note: e.note,
      category: e.category,
    });
  };

  const saveEdit = () => {
    onUpdate(editingId, {
      ...editData,
      amount: Number(editData.amount),
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-xl font-semibold">All Expenses</h1>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {["All", ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-lg text-sm whitespace-nowrap ${
              selectedCategory === cat
                ? "bg-blue-600"
                : "bg-zinc-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Groups */}
      {Object.entries(groupedExpenses).map(([label, items]) => (
        <div
          key={label}
          className="bg-zinc-900 p-4 rounded-2xl space-y-3"
        >
          <p className="text-sm text-zinc-400">{label}</p>

          {items.map((e) => (
            <div
              key={e.id}
              className="border-b border-zinc-800 pb-3 last:border-none"
            >
              {editingId === e.id ? (
                // ✏️ EDIT MODE
                <div className="space-y-3">
                  <input
                    type="number"
                    value={editData.amount}
                    onChange={(ev) =>
                      setEditData({
                        ...editData,
                        amount: ev.target.value,
                      })
                    }
                    className="w-full text-xl bg-transparent outline-none border-b border-zinc-700 pb-1"
                  />

                  <input
                    type="text"
                    value={editData.note}
                    onChange={(ev) =>
                      setEditData({
                        ...editData,
                        note: ev.target.value,
                      })
                    }
                    className="w-full bg-zinc-800 rounded px-2 py-1 text-sm outline-none"
                  />

                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c}
                        onClick={() =>
                          setEditData({
                            ...editData,
                            category: c,
                          })
                        }
                        className={`px-3 py-1 rounded-lg text-xs ${
                          editData.category === c
                            ? "bg-blue-600"
                            : "bg-zinc-800"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-4 text-sm pt-1">
                    <button
                      onClick={saveEdit}
                      className="text-blue-500 font-medium"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => setEditingId(null)}
                      className="text-zinc-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // 🧾 NORMAL VIEW
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-lg font-semibold">
                      ₹{e.amount}
                    </p>

                    <p className="text-sm text-zinc-400">
                      {e.note || e.category}
                      {e.note && ` • ${e.category}`}
                    </p>
                  </div>

                  <div className="text-right space-y-1">
                    <p className="text-xs text-zinc-500">
                      {new Date(e.timestamp).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>

                    {confirmDeleteId === e.id ? (
                      <div className="flex gap-3 justify-end text-xs">
                        <button
                          onClick={() => {
                            onDelete(e.id);
                            setConfirmDeleteId(null);
                          }}
                          className="text-red-500 font-medium"
                        >
                          Confirm
                        </button>

                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-zinc-400"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 justify-end text-xs">
                        <button
                          onClick={() => startEdit(e)}
                          className="text-blue-500"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => setConfirmDeleteId(e.id)}
                          className="text-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}