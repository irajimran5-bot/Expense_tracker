import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  const [totalIncome, setTotalIncome] = useState(user.totalIncome || 0);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [newIncome, setNewIncome] = useState("");
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [formData, setFormData] = useState({
    title: "",
    category: "Food",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  const totalExpenseAmount = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalBalance = totalIncome - totalExpenseAmount;

  const handleUpdateIncome = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.put("/expenses/update-income", { totalIncome: Number(newIncome) });
      setTotalIncome(data.user.totalIncome);
      localStorage.setItem("user", JSON.stringify({ ...user, totalIncome: data.user.totalIncome }));
      setIsEditingIncome(false);
    } catch (err) {
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
        console.error("Failed to fetch expenses");
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
      const { data } = await API.post("/expenses", { ...formData, amount: Number(formData.amount) });
      setExpenses((prev) => [data, ...prev]);
      setFormData({ title: "", amount: "", category: "Food", date: new Date().toISOString().split("T")[0] });
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
      alert("Failed to delete expense");
    }
  };

  const filteredExpenses = expenses.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryTotals = expenses.reduce((acc, item) => {
    const cat = item.category || "Other";
    acc[cat] = (acc[cat] || 0) + Number(item.amount || 0);
    return acc;
  }, {});

  const chartData = Object.keys(categoryTotals).map((cat) => ({ name: cat, value: categoryTotals[cat] }));
  const COLORS = ["#00f2fe", "#4facfe", "#10b981", "#3b82f6", "#a855f7", "#ec4899"];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = totalExpenseAmount ? ((data.value / totalExpenseAmount) * 100).toFixed(1) : 0;
      return (
        <div className="bg-[#0c1838]/90 text-white backdrop-blur-xl px-4 py-3 rounded-2xl border border-cyan-400 shadow-2xl text-xs space-y-1">
          <p className="font-semibold text-cyan-300">{data.name}</p>
          <p className="font-bold text-sm text-white">Rs. {Number(data.value).toFixed(2)} <span className="text-cyan-400 font-normal">({percentage}%)</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#040814] text-slate-100 pb-16 selection:bg-cyan-500 selection:text-white relative overflow-hidden">
      
      {/* Highly Prominent Aurora / Nebula Glowing Blobs */}
      <div className="absolute -top-20 -right-20 w-[700px] h-[700px] bg-gradient-to-br from-cyan-400/35 via-blue-600/30 to-emerald-400/35 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 -left-32 w-[600px] h-[600px] bg-gradient-to-tr from-blue-700/30 via-indigo-600/25 to-cyan-400/25 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute -bottom-20 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-emerald-500/25 via-cyan-500/30 to-blue-600/20 rounded-full blur-[90px] pointer-events-none" />

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-[#040814]/70 backdrop-blur-2xl border-b border-cyan-500/20 px-6 py-4 flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/40 font-extrabold text-white text-lg tracking-wider">S</div>
          <div>
            <h1 className="text-lg font-bold tracking-wide bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">SPENDWISE</h1>
            <p className="text-[11px] text-cyan-300/80">Welcome back, <span className="text-white font-medium">{user.name || "User"}</span></p>
          </div>
        </div>
        <button onClick={handleLogout} className="px-4 py-2 text-xs font-semibold text-cyan-300 bg-cyan-950/60 hover:bg-rose-500/20 hover:text-rose-400 border border-cyan-500/30 hover:border-rose-500/30 rounded-xl transition-all duration-200 shadow-sm">
          Logout
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 space-y-8 relative z-10">
        
        {/* Metric Cards with Glowing Borders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-[#0b132b]/70 backdrop-blur-2xl p-6 rounded-2xl border border-cyan-500/30 shadow-2xl relative overflow-hidden group hover:border-cyan-400 transition-all">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-cyan-500/20 rounded-full blur-xl group-hover:bg-cyan-500/40 transition-all" />
            <p className="text-xs font-semibold text-cyan-300/80 uppercase tracking-widest">Total Balance</p>
            <h3 className={`text-3xl font-extrabold mt-2 tracking-tight ${totalBalance >= 0 ? "text-white" : "text-rose-400"}`}>
              Rs. {totalBalance.toFixed(2)}
            </h3>
          </div>

          <div className="bg-[#0b132b]/70 backdrop-blur-2xl p-6 rounded-2xl border border-cyan-500/30 shadow-2xl relative overflow-hidden group hover:border-cyan-400 transition-all">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/20 rounded-full blur-xl group-hover:bg-emerald-500/40 transition-all" />
            <div className="flex justify-between items-center">
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">Total Income</p>
              <button onClick={() => { setNewIncome(totalIncome); setIsEditingIncome(true); }} className="text-xs bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 px-2.5 py-1 rounded-lg font-medium transition-all">
                ✏️ Edit
              </button>
            </div>
            <h3 className="text-3xl font-extrabold text-emerald-400 mt-2 tracking-tight">
              Rs. {Number(totalIncome).toFixed(2)}
            </h3>
          </div>

          <div className="bg-[#0b132b]/70 backdrop-blur-2xl p-6 rounded-2xl border border-cyan-500/30 shadow-2xl relative overflow-hidden group hover:border-cyan-400 transition-all">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-rose-500/20 rounded-full blur-xl group-hover:bg-rose-500/40 transition-all" />
            <p className="text-xs font-semibold text-rose-400 uppercase tracking-widest">Total Expenses</p>
            <h3 className="text-3xl font-extrabold text-rose-400 mt-2 tracking-tight">
              Rs. {totalExpenseAmount.toFixed(2)}
            </h3>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Add Expense Form */}
          <div className="bg-[#0b132b]/70 backdrop-blur-2xl p-6 rounded-2xl border border-cyan-500/30 shadow-2xl h-fit">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" /> Add New Expense
            </h2>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-cyan-300/80 uppercase tracking-wider mb-1.5">Title</label>
                <input type="text" required placeholder="e.g., Grocery Shopping" className="w-full bg-[#040814]/90 border border-cyan-500/30 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-cyan-300/80 uppercase tracking-wider mb-1.5">Amount (Rs.)</label>
                <input type="number" step="0.01" required placeholder="1500" className="w-full bg-[#040814]/90 border border-cyan-500/30 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-cyan-300/80 uppercase tracking-wider mb-1.5">Category</label>
                <select className="w-full bg-[#040814]/90 border border-cyan-500/30 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors cursor-pointer" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                  <option value="Food">Food & Dining</option>
                  <option value="Transport">Transport</option>
                  <option value="Bills">Bills & Utilities</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-cyan-300/80 uppercase tracking-wider mb-1.5">Date</label>
                <input type="date" required className="w-full bg-[#040814]/90 border border-cyan-500/30 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
              </div>
              <button type="submit" disabled={formLoading} className="w-full bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/30 disabled:opacity-50 mt-2 tracking-wide">
                {formLoading ? "Adding..." : "Add Expense"}
              </button>
            </form>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Chart Section */}
            <div className="bg-[#0b132b]/70 backdrop-blur-2xl p-6 rounded-2xl border border-cyan-500/30 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-white">Category Breakdown</h2>
                <span className="text-xs font-semibold text-cyan-300 bg-cyan-500/20 border border-cyan-500/40 px-3 py-1 rounded-full">
                  {chartData.length} Categories
                </span>
              </div>
              {chartData.length === 0 ? (
                <div className="py-12 text-center text-cyan-300/60 text-sm">No expenses logged yet to display analytics.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  <div className="md:col-span-3 h-60 relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={chartData} cx="50%" cy="50%" innerRadius={65} outerRadius={90} paddingAngle={6} dataKey="value" stroke="none">
                          {chartData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-all cursor-pointer" />)}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Spent</span>
                      <span className="text-base font-extrabold text-white">Rs.{totalExpenseAmount.toFixed(0)}</span>
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2 border-t md:border-t-0 md:border-l border-cyan-500/30 pt-4 md:pt-0 md:pl-6">
                    {chartData.map((entry, index) => {
                      const pct = totalExpenseAmount ? ((entry.value / totalExpenseAmount) * 100).toFixed(0) : 0;
                      return (
                        <div key={entry.name} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full shadow-md shadow-cyan-500/50" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                            <span className="font-medium text-slate-200 truncate max-w-[90px]">{entry.name}</span>
                          </div>
                          <div className="flex items-center gap-2 font-semibold text-white">
                            <span>Rs.{entry.value}</span>
                            <span className="text-[10px] text-cyan-300 bg-cyan-950/80 border border-cyan-500/30 px-1.5 py-0.5 rounded">{pct}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Transactions Section */}
            <div className="bg-[#0b132b]/70 backdrop-blur-2xl p-6 rounded-2xl border border-cyan-500/30 shadow-2xl">
              <h2 className="text-base font-bold text-white mb-4">Recent Transactions</h2>
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <input type="text" placeholder="Search by title..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 bg-[#040814]/90 border border-cyan-500/30 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-400" />
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="bg-[#040814]/90 border border-cyan-500/30 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 cursor-pointer">
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
                <p className="text-cyan-300 text-sm animate-pulse">Loading expenses...</p>
              ) : filteredExpenses.length === 0 ? (
                <p className="text-cyan-300/60 text-sm">No transactions found.</p>
              ) : (
                <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                  {filteredExpenses.map((item) => (
                    <div key={item._id} className="flex items-center justify-between p-4 bg-[#040814]/80 border border-cyan-500/20 rounded-xl hover:border-cyan-400 transition-all group">
                      <div className="space-y-1">
                        <p className="font-semibold text-white text-sm group-hover:text-cyan-300 transition-colors">{item.title}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded">
                            {item.category}
                          </span>
                          <span className="text-xs text-cyan-300/60">{new Date(item.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-bold text-rose-400 text-sm">-Rs. {Number(item.amount).toFixed(2)}</p>
                        <button onClick={() => handleDeleteExpense(item._id)} className="text-cyan-300/60 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/15 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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

      {/* Edit Income Modal */}
      {isEditingIncome && (
        <div className="fixed inset-0 bg-[#040814]/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#0b132b] border border-cyan-400 p-6 rounded-2xl max-w-sm w-full shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Set Total Income</h3>
            <form onSubmit={handleUpdateIncome} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-1.5">Amount (Rs.)</label>
                <input type="number" required min="0" step="0.01" className="w-full bg-[#040814] border border-cyan-500/40 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-400" value={newIncome} onChange={(e) => setNewIncome(e.target.value)} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsEditingIncome(false)} className="w-1/2 bg-[#040814] text-cyan-300 py-2.5 rounded-xl font-semibold hover:bg-cyan-950 transition-colors text-sm border border-cyan-500/30">Cancel</button>
                <button type="submit" className="w-1/2 bg-emerald-600 text-white py-2.5 rounded-xl font-semibold hover:bg-emerald-500 transition-colors text-sm shadow-lg shadow-emerald-600/30">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;