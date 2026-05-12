import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import LocationSelector from "../components/forms/LocationSelector";
import Logo from "../components/common/Logo";


export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    region: "",
    province: "",
    municipality: "",
    barangay: "",
    region_code: "",
    province_code: "",
    municipality_code: "",
    barangay_code: "",
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
      const res = await api.post("/register", form);
      const data = res.data;

      setMessage(data.message);

      if (data.status === "success") {
        setTimeout(() => {
          navigate("/login");
        }, 800);
      }
    } catch (error) {
      setMessage("Registration failed. Please complete all required fields.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        <div className="auth-logo-wrap">
  <Logo size="lg" showText={false} />
</div>

        <h2>Create Account</h2>
        <p>Register your account and assigned service area.</p>

        {message && <div className="auth-message">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <input
              name="first_name"
              placeholder="First name"
              value={form.first_name}
              onChange={handleChange}
              required
            />

            <input
              name="last_name"
              placeholder="Last name"
              value={form.last_name}
              onChange={handleChange}
              required
            />
          </div>

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

          <LocationSelector form={form} setForm={setForm} />

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <span className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </span>

        <Link to="/" className="back-home">Home</Link>
      </div>
    </div>
  );
}