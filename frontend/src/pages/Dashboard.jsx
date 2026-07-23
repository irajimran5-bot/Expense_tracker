import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "Food",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const { data } = await API.get("/expenses");
        setExpenses(Array.isArray(data) ? data : data.expenses || []);
      } catch (err) {
        console.error("Failed to fetch expenses: ", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const { data } = await API.post("/expenses", {
        ...formData,
        amount: Number(formData.amount),
      });
      setExpenses((prev) => [data, ...prev]);

      setFormData({
        title: "",
        amount: "",
        category: "Food",
        date: new Date().toISOString().split("T")[0],
      });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add expense");
    } finally {
      setFormLoading(false);
    }
  };
  const handleDeleteExpense = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    try {
      await API.delete(`/expenses/${id}`);
      // UI se instantly remove kar dein
      setExpenses((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete expense");
    }
  };
  // Dynamic Total Calculation
  const totalExpenseAmount = expenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );
  const filteredExpenses = expenses.filter((item) => {
  const matchesSearch = item.title
    .toLowerCase()
    .includes(searchTerm.toLowerCase());
  const matchesCategory =
    selectedCategory === "All" || item.category === selectedCategory;

  return matchesSearch && matchesCategory;
  });
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* 1. Top Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-violet-600">Expense Tracker</h1>
          <p className="text-xs text-slate-500">
            Welcome, <span className="font-semibold text-slate-700">{user.name || "User"}</span>
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors"
        >
          Logout
        </button>
      </nav>

      <main className="max-w-6xl mx-auto px-4 mt-8 space-y-8">
        {/* 2. Top Summary Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Balance</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-2">Rs. 0.00</h3>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider">Total Income</p>
            <h3 className="text-3xl font-bold text-teal-600 mt-2">Rs. 0.00</h3>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-rose-500 uppercase tracking-wider">Total Expenses</p>
            <h3 className="text-3xl font-bold text-rose-600 mt-2">
              Rs. {totalExpenseAmount.toFixed(2)}
            </h3>
          </div>
        </div>

        {/* 3. Main 2-Column Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Add New Expense</h2>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Grocery Shopping"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 text-sm focus:outline-none focus:border-violet-600"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  Amount (Rs.)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="25.00"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 text-sm focus:outline-none focus:border-violet-600"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 text-sm focus:outline-none focus:border-violet-600"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Food">Food & Dining</option>
                  <option value="Transport">Transport</option>
                  <option value="Bills">Bills & Utilities</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-slate-900 text-sm focus:outline-none focus:border-violet-600"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors duration-200 shadow-sm disabled:opacity-50 mt-2"
              >
                {formLoading ? "Adding..." : "Add Expense"}
              </button>
            </form>
          </div>

          {/* Right Column: Expense List */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Transactions</h2>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-1.5 text-sm focus:outline-none focus:border-violet-600"
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-1.5 text-sm focus:outline-none focus:border-violet-600"
            >
              <option value="All">All Categories</option>
              <option value="Food">Food & Dining</option>
              <option value="Transport">Transport</option>
              <option value="Bills">Bills & Utilities</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Shopping">Shopping</option>
              <option value="Other">Other</option>
            </select>
          </div>
            {loading ? (
              <p className="text-slate-500 text-sm animate-pulse">Loading expenses...</p>
            ) : expenses.length === 0 ? (
              <p className="text-slate-400 text-sm">No expenses added yet. Create one on the left!</p>
            ) : (
              <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                {filteredExpenses.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-violet-300 transition-colors"
                  >
                    {/* Left Side: Info */}
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-800 text-sm">{item.title}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-wide bg-violet-100 text-violet-700 px-2 py-0.5 rounded-md">
                          {item.category}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Right Side: Grouped Amount & Delete Button */}
                    <div className="flex items-center gap-4">
                      <p className="font-bold text-rose-600 text-base">
                        -Rs. {Number(item.amount).toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleDeleteExpense(item._id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete expense"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;