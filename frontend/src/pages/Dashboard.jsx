import { useState, useEffect } from "react";
import API from "../api/axios";

const Dashboard = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [newIncome, setNewIncome] = useState("");

  const totalExpenses = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
  
  const totalBalance = totalIncome - totalExpenses;

  const handleUpdateIncome = async (e) => {
    e.preventDefault();
    try {
      await API.put("/api/auth/update-income", { totalIncome: Number(newIncome) });
      
      setTotalIncome(Number(newIncome));
      setIsEditingIncome(false);
    } catch (err) {
      console.error("Income update failed", err);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      
      {/* Top Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Total Income Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-500 text-sm font-medium">Total Income</span>
            <button 
              onClick={() => { setNewIncome(totalIncome); setIsEditingIncome(true); }}
              className="text-xs bg-violet-50 text-violet-600 px-2.5 py-1 rounded-md hover:bg-violet-100 transition-colors font-medium"
            >
              ✏️ Edit
            </button>
          </div>
          <h3 className="text-2xl font-bold text-emerald-600">${totalIncome}</h3>
        </div>

        {/* Total Expenses Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-slate-500 text-sm font-medium block mb-2">Total Expenses</span>
          <h3 className="text-2xl font-bold text-rose-600">${totalExpenses}</h3>
        </div>

        {/* Total Balance Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-slate-500 text-sm font-medium block mb-2">Total Balance</span>
          <h3 className={`text-2xl font-bold ${totalBalance >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
            ${totalBalance}
          </h3>
        </div>
      </div>

      {/* Edit Income Modal / Pop-up */}
      {isEditingIncome && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Set Total Income</h3>
            <form onSubmit={handleUpdateIncome} className="space-y-4">
              <input
                type="number"
                required
                className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:border-violet-600 text-slate-900"
                placeholder="Enter new income"
                value={newIncome}
                onChange={(e) => setNewIncome(e.target.value)}
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditingIncome(false)}
                  className="w-1/2 bg-slate-100 text-slate-600 py-2.5 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-violet-600 text-white py-2.5 rounded-lg font-semibold hover:bg-violet-700 transition-colors"
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