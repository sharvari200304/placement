import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import AuthShell from "./AuthShell.jsx";

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student", companyName: "" });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const user = await register(form);
      navigate(`/${user.role}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthShell title="Create account" subtitle="Choose a role to start the matching workflow.">
      <form onSubmit={submit} className="card space-y-4">
        {error && <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950 dark:text-rose-200">{error}</p>}
        <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} minLength={8} required />
        <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="student">Student</option>
          <option value="company">Company</option>
        </select>
        {form.role === "company" && (
          <input className="input" placeholder="Company name" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
        )}
        <button className="btn-primary w-full" disabled={loading}><UserPlus size={18} /> Register</button>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Already registered? <Link className="font-semibold text-teal-700 dark:text-teal-300" to="/login">Log in</Link>
        </p>
      </form>
    </AuthShell>
  );
};

export default Register;
