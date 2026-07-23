import { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import API from "../api/axios";

const Login=()=>{
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await API.post("/api/auth/login", formData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    } 
};
return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
        <h2 className="text-3xl font-bold text-center text-violet-600 mb-2">Welcome Back</h2>
        <p className="text-slate-500 text-center text-sm mb-6">Log in to track your expenses</p>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/50 text-rose-400 text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-violet-600 text-slate-900"
              placeholder="name@gmail.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-violet-600 text-slate-900"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-lg transition-colors duration-200 mt-2 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-slate-400 text-sm text-center mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-violet-600 hover:underline font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Login;