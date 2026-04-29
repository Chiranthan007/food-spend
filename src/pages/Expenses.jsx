import { useState } from "react";
import { CATEGORIES } from "../constants/categories";

export default function Expenses({ expenses, onDelete, onUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [editAmount, setEditAmount] = useState("");
  const [editNote, setEditNote] = useState("");
  const [editCategory, setEditCategory] = useState("");

  const [filter, setFilter] = useState("All");

  const capitalize = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const startEdit = (e) => {
    setEditingId(e.id);
    setEditAmount(e.amount);
    setEditNote(e.note || "");
    setEditCategory(e.category || "Other");
    setDeletingId(null);
  };

  const handleSave = (id) => {
    const val = Number(editAmount);
    if (!val || val <= 0) return;

    onUpdate(id, {
      amount: val,
      note: capitalize(editNote),
      category: editCategory,
    });

    setEditingId(null);
  };

  // 🔍 FILTER
  const filtered =
    filter === "All"
      ? expenses
      : expenses.filter((e) => e.category === filter);

  const now = new Date();

  const isToday = (date) => {
    const d = new Date(date);
    return d.toDateString() === now.toDateString();
  };

  const isYesterday = (date) => {
    const d = new Date(date);
    const y = new Date();
    y.setDate(now.getDate() - 1);
    return d.toDateString() === y.toDateString();
  };

  // 📦 GROUPING
  const today = filtered.filter((e) => isToday(e.timestamp));
  const yesterday = filtered.filter((e) => isYesterday(e.timestamp));
  const earlier = filtered.filter(
    (e) => !isToday(e.timestamp) && !isYesterday(e.timestamp)
  );

  const renderGroup = (title, items) => {
    if (items.length === 0) return null;

    return (
      <div>
        <p className="text-xs text-zinc-500 px-2 py-2">{title}</p>

        {items.map((e) => (
          <div key={e.id} className="p-4 border-b border-zinc-800">

            {editingId === e.id ? (
              <div className="space-y-3">
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="w-full bg-zinc-800 rounded-lg px-3 py-2 text-sm outline-none"
                />

                <input
                  type="text"
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  className="w-full bg-zinc-800 rounded-lg px-3 py-2 text-sm outline-none"
                />

                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setEditCategory(cat)}
                      className={`px-3 py-1 rounded-lg text-xs ${
                        editCategory === cat
                          ? "bg-blue-600"
                          : "bg-zinc-800"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave(e.id)}
                    className="flex-1 bg-green-600 py-2 rounded-lg text-sm"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 bg-zinc-700 py-2 rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : deletingId === e.id ? (
              <div className="space-y-3">
                <p className="text-sm text-zinc-400">
                  Delete this expense?
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onDelete(e.id);
                      setDeletingId(null);
                    }}
                    className="flex-1 bg-red-600 py-2 rounded-lg text-sm"
                  >
                    Confirm
                  </button>

                  <button
                    onClick={() => setDeletingId(null)}
                    className="flex-1 bg-zinc-700 py-2 rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-base">₹{e.amount}</p>
                  <p className="text-xs text-zinc-400">
                    {e.note || "No note"} • {e.category}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-400">
                    {new Date(e.timestamp).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>

                  <button
                    onClick={() => startEdit(e)}
                    className="text-blue-500 text-xs"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => setDeletingId(e.id)}
                    className="text-red-500 text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}

          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4 pb-20">
      <h1 className="text-xl font-semibold">All Expenses</h1>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          onClick={() => setFilter("All")}
          className={`px-3 py-1 rounded-lg text-xs ${
            filter === "All" ? "bg-blue-600" : "bg-zinc-800"
          }`}
        >
          All
        </button>

        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-3 py-1 rounded-lg text-xs ${
              filter === c ? "bg-blue-600" : "bg-zinc-800"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-zinc-900 rounded-2xl">
        {filtered.length === 0 ? (
          <div className="p-4 text-sm text-zinc-500">
            No expenses for this category
          </div>
        ) : (
          <>
            {renderGroup("Today", today)}
            {renderGroup("Yesterday", yesterday)}
            {renderGroup("Earlier", earlier)}
          </>
        )}
      </div>
    </div>
  );
}