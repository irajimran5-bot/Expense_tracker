import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-4xl mx-auto flex justify-between items-center border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-emerald-400">Expense Tracker</h1>
          <p className="text-slate-400 text-sm">Welcome, {user.name || "User"} 👋</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="max-w-4xl mx-auto mt-12 text-center text-slate-500">
        <p>Dashboard UI & Expense List feature loading next...</p>
      </div>
    </div>
  );
};

export default Dashboard;