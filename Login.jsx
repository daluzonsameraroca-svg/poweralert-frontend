import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Logo from "../components/common/Logo";


export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("/login", form);
      const data = res.data;

      setMessage(data.message);

      if (data.status === "success") {
        localStorage.setItem("user", JSON.stringify(data.user));

        if (data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      setMessage("Login failed. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo-wrap">
  <Logo size="lg" showText={false} />
</div>

        <h2>Welcome Back</h2>
        <p>Login to continue to ElectroPulse.</p>

        {message && <div className="auth-message">{message}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <span className="auth-switch">
          No account yet? <Link to="/register">Create account</Link>
        </span>

        <Link to="/" className="back-home">Home</Link>
      </div>
    </div>
  );
}