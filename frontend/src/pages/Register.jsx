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
    <div className="min-h-screen bg-[#070d1d] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-blue-600/20 to-emerald-400/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="w-full max-w-md bg-[#0c1633]/60 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-cyan-500/20 relative z-10">
        <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent mb-2">CREATE ACCOUNT</h2>
        <p className="text-cyan-300/70 text-center text-xs mb-6 uppercase tracking-wider font-semibold">Start managing your personal finance</p>

        {error && <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs p-3 rounded-xl mb-4 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-cyan-300/70 uppercase tracking-wider mb-1.5">Full Name</label>
            <input type="text" required className="w-full bg-[#050b18]/80 border border-cyan-500/20 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400" placeholder="Your Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-cyan-300/70 uppercase tracking-wider mb-1.5">Email</label>
            <input type="email" required className="w-full bg-[#050b18]/80 border border-cyan-500/20 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400" placeholder="name@gmail.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-cyan-300/70 uppercase tracking-wider mb-1.5">Password</label>
            <input type="password" required className="w-full bg-[#050b18]/80 border border-cyan-500/20 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/25 mt-2 disabled:opacity-50 text-sm tracking-wide">
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="text-cyan-300/70 text-xs text-center mt-6">
          Already have an account? <Link to="/login" className="text-cyan-400 hover:underline font-semibold">Log In</Link>
        </p>
      </div>
    </div>
  );
};
export default Register;