import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Login({ variant = "light", embedded = false }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  useEffect(() => {
    if (location.state?.success) {
      setInfo(location.state.success);
    }
  }, [location.state]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <div className={`auth-container ${variant} ${embedded ? "embedded" : ""}`}>
      <h2>Welcome back</h2>
      <form onSubmit={onSubmit} className="auth-form">
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required />
        {info && <div className="info">{info}</div>}
        {error && <div className="error">{error}</div>}
        <button disabled={loading}>{loading ? "Signing in..." : "Log in"}</button>
      </form>
      <p className="swap-link">New here? <Link to="/signup">Create an account</Link></p>
    </div>
  );

  if (embedded) return content;
  return <div className={`auth-gate ${variant === "dark" ? "dark" : ""}`}>{content}</div>;
}
