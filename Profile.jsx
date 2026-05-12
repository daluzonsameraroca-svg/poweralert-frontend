import { useEffect, useState } from "react";
import LocationSelector from "../../components/forms/LocationSelector";
import api from "../../api/axios";
import { getUserBills } from "../../api/billApi";

export default function Profile() {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [bills, setBills] = useState([]);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    region: "",
    province: "",
    municipality: "",
    barangay: "",
    region_code: "",
    province_code: "",
    municipality_code: "",
    barangay_code: "",
  });

  useEffect(() => {
    loadProfile();
    loadBills();
  }, []);

  async function loadBills() {
  try {
    const res = await getUserBills(currentUser.user_id);
    setBills(Array.isArray(res.data) ? res.data : []);
  } catch {
    setBills([]);
  }
}

  async function loadProfile() {
    try {
      const res = await api.get(`/profile/${currentUser.user_id}`);
      const data = res.data;

      setForm({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        region: data.region || "",
        province: data.province || "",
        municipality: data.municipality || "",
        barangay: data.barangay || "",
        region_code: data.region_code || "",
        province_code: data.province_code || "",
        municipality_code: data.municipality_code || "",
        barangay_code: data.barangay_code || "",
      });
    } catch {
      setMessage("Failed to load profile.");
    }
  }

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await api.put(`/profile/${currentUser.user_id}`, form);
      setMessage(res.data.message || "Profile updated successfully.");

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...currentUser,
          ...form,
        })
      );

      setShowModal(false);
    } catch {
      setMessage("Failed to update profile.");
    }
  }

  return (
    <>
      <div className="profile-dashboard">
        <div className="profile-dashboard-header">
          <div>
            <h1>Welcome, {form.first_name || "User"}</h1>
            <p>Manage your account information and service area.</p>
          </div>

          <button onClick={() => setShowModal(true)}>Edit Profile</button>
        </div>

        {message && <div className="auth-message">{message}</div>}

        <div className="profile-banner"></div>

        <div className="profile-main-card">
          <div className="profile-main-top">
            <div className="profile-main-avatar">
              {form.first_name?.[0] || "U"}
              {form.last_name?.[0] || ""}
            </div>

            <div>
              <h2>
                {form.first_name} {form.last_name}
              </h2>
              <p>{form.email}</p>
            </div>
          </div>

          <div className="profile-details-grid">
            <div className="profile-field">
              <span>Full Name</span>
              <strong>
                {form.first_name} {form.last_name}
              </strong>
            </div>

            <div className="profile-field">
              <span>Email Address</span>
              <strong>{form.email}</strong>
            </div>

            <div className="profile-field">
              <span>Region</span>
              <strong>{form.region || "N/A"}</strong>
            </div>

            <div className="profile-field">
              <span>Province</span>
              <strong>{form.province || "N/A"}</strong>
            </div>

            <div className="profile-field">
              <span>Municipality</span>
              <strong>{form.municipality || "N/A"}</strong>
            </div>

            <div className="profile-field">
              <span>Barangay</span>
              <strong>{form.barangay || "N/A"}</strong>
            </div>
          </div>

          <div className="profile-email-section">
            <h3>My Email Address</h3>
            <p>{form.email}</p>
          </div>

          <div className="profile-history-section">
  <h3>Billing History</h3>

  {bills.length === 0 ? (
    <p>No billing history available yet.</p>
  ) : (
    bills.slice(0, 5).map((bill) => (
      <div className="profile-history-item" key={bill.bill_id}>
        <div>
          <strong>{bill.billing_month}</strong>
          <span>Due: {bill.due_date}</span>
        </div>

        <div>
          <strong>₱{bill.amount}</strong>
          <span>{bill.status}</span>
        </div>
      </div>
    ))
  )}
</div>
        </div>
      </div>


      {showModal && (
        <div className="profile-modal-backdrop">
          <div className="profile-modal-card">
            <button
              className="profile-modal-close"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>

            <h2>Update Profile</h2>
            <p>Update your account details and assigned service area.</p>

            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <input
                  name="first_name"
                  placeholder="First Name"
                  value={form.first_name}
                  onChange={handleChange}
                  required
                />

                <input
                  name="last_name"
                  placeholder="Last Name"
                  value={form.last_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
              />

              <LocationSelector form={form} setForm={setForm} />

              <button type="submit">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}