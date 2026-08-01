import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await API.post("/auth/register", formData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden selection:bg-cyan-400 selection:text-slate-900">
      {/* Soft Glowing Ambient Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-gradient-to-tr from-cyan-400/25 to-indigo-500/25 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border border-cyan-400/30 relative z-10">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/30 font-extrabold text-slate-950 text-xl mx-auto mb-3">S</div>
          <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-300 tracking-wide">CREATE ACCOUNT</h2>
          <p className="text-cyan-200/80 text-xs mt-1 uppercase tracking-wider font-medium">Start managing your personal finance</p>
        </div>

        {error && <div className="bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs p-3 rounded-xl mb-4 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-cyan-200/90 uppercase tracking-wider mb-1.5">Full Name</label>
            <input type="text" required className="w-full bg-slate-950/60 border border-cyan-400/30 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-300 transition-all" placeholder="Your Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-cyan-200/90 uppercase tracking-wider mb-1.5">Email</label>
            <input type="email" required className="w-full bg-slate-950/60 border border-cyan-400/30 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-300 transition-all" placeholder="name@gmail.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-cyan-200/90 uppercase tracking-wider mb-1.5">Password</label>
            <input type="password" required className="w-full bg-slate-950/60 border border-cyan-400/30 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-300 transition-all" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-extrabold py-3.5 rounded-2xl transition-all shadow-xl shadow-cyan-500/20 mt-2 disabled:opacity-50 text-sm tracking-wide">
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="text-cyan-200/80 text-xs text-center mt-6">
          Already have an account? <Link to="/login" className="text-cyan-300 hover:text-white font-bold underline underline-offset-4">Log In</Link>
        </p>
      </div>
    </div>
  );
};
export default Register;