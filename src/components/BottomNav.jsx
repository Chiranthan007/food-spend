import { Link, useLocation } from "react-router-dom";

export default function BottomNav() {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? "text-white" : "text-zinc-500";

  return (
    <div className="fixed bottom-0 left-0 w-full bg-zinc-900 border-t border-zinc-800 flex justify-around py-3">
      
      <Link to="/" className={isActive("/")}>
        Home
      </Link>

      <Link to="/expenses" className={isActive("/expenses")}>
        Expenses
      </Link>

      <Link to="/insights" className={isActive("/insights")}>
        Insights
      </Link>

    </div>
  );
}