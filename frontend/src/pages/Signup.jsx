import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstname: "", lastname: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(form.firstname, form.lastname, form.email, form.password);
      navigate("/login", { replace: true, state: { success: "Account created! Please log in." } });
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-gate">
      <div className="auth-container">
        <h2>Create Account</h2>
        <form onSubmit={onSubmit} className="auth-form">
          <div className="row">
            <input name="firstname" placeholder="First name" value={form.firstname} onChange={onChange} required />
            <input name="lastname" placeholder="Last name" value={form.lastname} onChange={onChange} required />
          </div>
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
          <input name="password" type="password" placeholder="Password (min 6)" value={form.password} onChange={onChange} required minLength={6} />
          {error && <div className="error">{error}</div>}
          <button disabled={loading}>{loading ? "Creating..." : "Sign up"}</button>
        </form>
        <p className="swap-link">Already have an account? <Link to="/login">Log in</Link></p>
      </div>
    </div>
  );
}
