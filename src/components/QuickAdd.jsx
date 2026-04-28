import { useState } from "react";

export default function QuickAdd({ onAdd }) {
  const [amount, setAmount] = useState("");

  const quickValues = [100, 150, 200, 250];

  const handleAdd = (val) => {
    const finalAmount = val || amount;
    if (!finalAmount) return;

    onAdd({
      id: Date.now(),
      amount: Number(finalAmount),
      timestamp: new Date().toISOString(),
    });

    setAmount("");
  };

  return (
    <div className="bg-zinc-900 p-5 rounded-2xl shadow-lg">
      {/* Input */}
      <input
        type="number"
        placeholder="₹"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full text-4xl bg-transparent outline-none text-white placeholder-zinc-600 mb-4"
      />

      {/* Quick Buttons */}
      <div className="flex gap-2 mb-4">
        {quickValues.map((val) => (
          <button
            key={val}
            onClick={() => handleAdd(val)}
            className="flex-1 bg-zinc-800 py-2 rounded-xl text-sm active:scale-95 transition"
          >
            ₹{val}
          </button>
        ))}
      </div>

      {/* Add Button */}
      <button
        onClick={() => handleAdd()}
        className="w-full bg-blue-600 py-3 rounded-xl text-lg font-medium active:scale-95 transition"
      >
        Add Expense
      </button>
    </div>
  );
}