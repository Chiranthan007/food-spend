import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Expenses from "./pages/Expenses";
import Insights from "./pages/Insights";
import BottomNav from "./components/BottomNav";

export default function App() {
  // 🔁 Load expenses
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });

  // 🔁 Load budget
  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem("budget");
    return saved ? Number(saved) : 0;
  });

  // 💾 Save expenses
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  // 💾 Save budget
  useEffect(() => {
    localStorage.setItem("budget", budget);
  }, [budget]);

  // ➕ Add expense
  const addExpense = (data) => {
    const newExpense = {
      id: Date.now(),
      amount: data.amount,
      note: data.note || "",
      category: data.category || "Other",
      timestamp: new Date().toISOString(),
    };

    setExpenses((prev) => [newExpense, ...prev]);
  };

  // ❌ Delete expense
  const deleteExpense = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // ✏️ Update expense
  const updateExpense = (id, updatedData) => {
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, ...updatedData } : e
      )
    );
  };

  return (
    <BrowserRouter>
      {/* 🔥 THIS is the actual scroll container */}
      <div className="h-screen overflow-y-auto no-scrollbar bg-black text-white px-4 py-6">

        <Routes>
          <Route
            path="/"
            element={
              <Home
                expenses={expenses}
                onAdd={addExpense}
                budget={budget}
                setBudget={setBudget}
              />
            }
          />

          <Route
            path="/expenses"
            element={
              <Expenses
                expenses={expenses}
                onDelete={deleteExpense}
                onUpdate={updateExpense}
              />
            }
          />

          <Route
            path="/insights"
            element={
              <Insights
                expenses={expenses}
                budget={budget}
              />
            }
          />
        </Routes>

        <BottomNav />
      </div>
    </BrowserRouter>
  );
}