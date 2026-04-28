import { useState, useEffect } from "react";
import QuickAdd from "./components/QuickAdd";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // ✅ Load from localStorage ONCE
  useEffect(() => {
    try {
      const stored = localStorage.getItem("expenses");
      if (stored) {
        setExpenses(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Load error:", err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // ✅ Save ONLY after load is complete
  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem("expenses", JSON.stringify(expenses));
    } catch (err) {
      console.error("Save error:", err);
    }
  }, [expenses, isLoaded]);

  const handleAdd = (expense) => {
    setExpenses((prev) => [expense, ...prev]);
  };

  const todayTotal = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-4 py-6 md:px-6 md:py-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-6">
        
        {/* LEFT PANEL */}
        <div className="space-y-6 bg-zinc-900 p-5 md:p-6 rounded-2xl">
          
          {/* Header */}
          <div className="flex justify-between items-center pt-1">
            <h1 className="text-xl md:text-2xl font-semibold">Food Spend</h1>
            <div className="text-xs md:text-sm text-zinc-400">
              {new Date().toLocaleDateString()}
            </div>
          </div>

          {/* Quick Add */}
          <QuickAdd onAdd={handleAdd} />

          {/* Today Card */}
          <div className="bg-zinc-800 p-4 md:p-5 rounded-2xl">
            <p className="text-sm text-zinc-400 mb-1">Today</p>
            <p className="text-2xl md:text-3xl font-semibold">
              ₹{todayTotal}
            </p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-zinc-900 rounded-2xl divide-y divide-zinc-800 md:overflow-y-auto md:max-h-[80vh] scroll-smooth">
          {expenses.map((e) => (
            <div
              key={e.id}
              className="flex justify-between items-center px-4 md:px-5 py-3 md:py-4 hover:bg-zinc-800/50 transition"
            >
              <span className="text-base md:text-lg font-medium">
                ₹{e.amount}
              </span>

              <span className="text-xs md:text-sm text-zinc-400">
                {new Date(e.timestamp).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;