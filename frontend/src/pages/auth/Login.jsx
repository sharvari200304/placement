import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import AuthShell from "./AuthShell.jsx";

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const user = await login(form);
      navigate(`/${user.role}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthShell title="Log in" subtitle="Use your student, company, or admin account.">
      <form onSubmit={submit} className="card space-y-4">
        {error && <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950 dark:text-rose-200">{error}</p>}
        <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <button className="btn-primary w-full" disabled={loading}><LogIn size={18} /> Log in</button>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          New here? <Link className="font-semibold text-teal-700 dark:text-teal-300" to="/register">Create an account</Link>
        </p>
      </form>
    </AuthShell>
  );
};

export default Login;
