import { useState, useEffect } from "react";
import { CATEGORIES } from "../constants/categories";

export default function QuickAdd({ onAdd }) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  // 🧠 Load last category
  const [category, setCategory] = useState(() => {
    const saved = localStorage.getItem("lastCategory");
    return saved || "Other";
  });

  const quickValues = [100, 150, 200, 250];

  // 💾 Save last category
  useEffect(() => {
    localStorage.setItem("lastCategory", category);
  }, [category]);

  // ✨ Capitalize helper
  const capitalize = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const handleAdd = () => {
    const val = Number(amount);
    if (!val || val <= 0) return;

    onAdd({
      amount: val,
      note: capitalize(note),
      category,
    });

    // 🧼 Reset (smart reset)
    setAmount("");
    setNote("");
    // ❗ category stays
  };

  return (
    <div className="bg-zinc-900 p-5 rounded-2xl shadow-lg space-y-4">
      
      {/* Amount */}
      <input
        type="number"
        placeholder="₹"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full text-4xl bg-transparent outline-none text-white placeholder-zinc-600"
        autoFocus
      />

      {/* Note */}
      <input
        type="text"
        placeholder="What was it?"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full bg-zinc-800 rounded-lg px-3 py-2 text-sm outline-none"
      />

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-3 py-1 rounded-lg text-xs ${
              category === c ? "bg-blue-600" : "bg-zinc-800"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Quick values */}
      <div className="flex gap-2">
        {quickValues.map((val) => (
          <button
            key={val}
            onClick={() => setAmount(val)}
            className="flex-1 bg-zinc-800 py-2 rounded-xl text-sm active:scale-95 transition"
          >
            ₹{val}
          </button>
        ))}
      </div>

      {/* Add */}
      <button
        onClick={handleAdd}
        className="w-full bg-blue-600 py-3 rounded-xl text-lg font-medium active:scale-95 transition"
      >
        Add Expense
      </button>
    </div>
  );
}