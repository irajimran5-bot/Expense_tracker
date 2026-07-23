import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  // State
  const [totalIncome, setTotalIncome] = useState(user.totalIncome || 0);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [newIncome, setNewIncome] = useState("");
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [formData, setFormData] = useState({
    title: "",
    category: "Food",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Dynamic Calculations
  const totalExpenseAmount = expenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );
  const totalBalance = totalIncome - totalExpenseAmount;

  // Income update handler
const handleUpdateIncome = async (e) => {
  e.preventDefault();
  try {
    const { data } = await API.put("/update-income", { 
      totalIncome: Number(newIncome) 
    });
    
    setTotalIncome(data.user.totalIncome);
    
    const updatedUser = { ...user, totalIncome: data.user.totalIncome };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    
    setIsEditingIncome(false);
  } catch (err) {
    console.error("Income update failed", err);
    alert("Failed to update income");
  }
};

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
      setExpenses((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete expense");
    }
  };

  // Filter Logic
  const filteredExpenses = expenses.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Chart Data Processing
  const categoryTotals = expenses.reduce((acc, item) => {
    const cat = item.category || "Other";
    acc[cat] = (acc[cat] || 0) + Number(item.amount || 0);
    return acc;
  }, {});

  const chartData = Object.keys(categoryTotals).map((cat) => ({
    name: cat,
    value: categoryTotals[cat],
  }));

  const COLORS = ["#8b5cf6", "#06b6d4", "#f43f5e", "#f59e0b", "#10b981", "#6366f1"];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = totalExpenseAmount
        ? ((data.value / totalExpenseAmount) * 100).toFixed(1)
        : 0;

      return (
        <div className="bg-slate-900/95 text-white backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-800 shadow-xl text-xs space-y-1">
          <p className="font-semibold text-slate-300">{data.name}</p>
          <p className="font-bold text-sm text-violet-400">
            Rs. {Number(data.value).toFixed(2)}
            <span className="text-slate-400 font-normal ml-1.5">({percentage}%)</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12 relative">
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
          {/* Total Balance Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Balance</p>
            <h3 className={`text-3xl font-bold mt-2 ${totalBalance >= 0 ? "text-slate-900" : "text-rose-600"}`}>
              Rs. {totalBalance.toFixed(2)}
            </h3>
          </div>

          {/* Total Income Card with Edit Button */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
            <div className="flex justify-between items-center">
              <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider">Total Income</p>
              <button
                onClick={() => {
                  setNewIncome(totalIncome);
                  setIsEditingIncome(true);
                }}
                className="text-xs bg-teal-50 text-teal-700 hover:bg-teal-100 px-2 py-1 rounded font-medium transition-colors"
              >
                ✏️ Edit
              </button>
            </div>
            <h3 className="text-3xl font-bold text-teal-600 mt-2">
              Rs. {Number(totalIncome).toFixed(2)}
            </h3>
          </div>

          {/* Total Expenses Card */}
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
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
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

          {/* Right Column: Chart & Transactions */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Styled Donut Chart Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800">Category Breakdown</h2>
                <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                  {chartData.length} Active Categories
                </span>
              </div>

              {chartData.length === 0 ? (
                <div className="py-12 text-center space-y-1">
                  <p className="text-slate-400 text-sm font-medium">No expenses logged yet.</p>
                  <p className="text-slate-300 text-xs">Add an entry on the left to see analytics.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  <div className="md:col-span-3 h-64 relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={65}
                          outerRadius={92}
                          paddingAngle={4}
                          dataKey="value"
                          stroke="none"
                        >
                          {chartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                              className="hover:opacity-85 transition-opacity cursor-pointer"
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>

                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                        Spent
                      </span>
                      <span className="text-lg font-extrabold text-slate-800">
                        Rs.{totalExpenseAmount > 1000 ? `${(totalExpenseAmount / 1000).toFixed(1)}k` : totalExpenseAmount.toFixed(0)}
                      </span>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2.5 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                    {chartData.map((entry, index) => {
                      const pct = totalExpenseAmount
                        ? ((entry.value / totalExpenseAmount) * 100).toFixed(0)
                        : 0;
                      return (
                        <div key={entry.name} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="font-medium text-slate-600 truncate max-w-[90px]">
                              {entry.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 font-semibold text-slate-800">
                            <span>Rs.{entry.value}</span>
                            <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                              {pct}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Expense List */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
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
              ) : filteredExpenses.length === 0 ? (
                <p className="text-slate-400 text-sm">No expenses match your search.</p>
              ) : (
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                  {filteredExpenses.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-violet-300 transition-colors"
                    >
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
        </div>
      </main>

      {/* 4. Edit Income Modal */}
      {isEditingIncome && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Set Total Income</h3>
            <form onSubmit={handleUpdateIncome} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  Income Amount (Rs.)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  className="w-full border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-violet-600"
                  placeholder="Enter total income"
                  value={newIncome}
                  onChange={(e) => setNewIncome(e.target.value)}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingIncome(false)}
                  className="w-1/2 bg-slate-100 text-slate-600 py-2.5 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-teal-600 text-white py-2.5 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;