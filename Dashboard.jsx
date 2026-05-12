import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import { getUserDashboard } from "../../api/dashboardApi";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState({
    interruptions: 0,
    unpaidBills: 0,
    reports: 0,
    notifications: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.user_id) return;

    loadDashboard();

    const interval = setInterval(loadDashboard, 5000);

    return () => clearInterval(interval);
  }, []);

  async function loadDashboard() {
    try {
      const res = await getUserDashboard(user.user_id);
      setStats(res.data);
    } catch (error) {
      console.log("Failed to load user dashboard", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        title={`Welcome, ${user?.first_name || "User"}`}
        subtitle={`Monitor updates for ${user?.barangay || "your barangay"}, ${
          user?.municipality || "your municipality"
        }.`}
      />

      {loading ? (
        <Card title="Loading">
          <p>Loading your dashboard...</p>
        </Card>
      ) : (
        <div className="cards-grid">
          <div
            className="dashboard-card-link"
            onClick={() => navigate("/interruptions")}
          >
            <Card title="Area Interruptions">
              <h2>{stats.interruptions}</h2>
              <p>Active or scheduled interruptions in your area</p>
            </Card>
          </div>

          <div
            className="dashboard-card-link"
            onClick={() => navigate("/bills")}
          >
            <Card title="Unpaid Bills">
              <h2>{stats.unpaidBills}</h2>
              <p>Bills waiting for payment</p>
            </Card>
          </div>

          <div
            className="dashboard-card-link"
            onClick={() => navigate("/reports")}
          >
            <Card title="Your Reports">
              <h2>{stats.reports}</h2>
              <p>Damage reports you submitted</p>
            </Card>
          </div>

          <div
            className="dashboard-card-link"
            onClick={() => navigate("/notifications")}
          >
            <Card title="Notifications">
              <h2>{stats.notifications}</h2>
              <p>Latest alerts and reminders</p>
            </Card>
          </div>
        </div>
      )}

      <Card title="Energy Saving Assistant">
        <p>
          ElectroPulse analyzes your latest bill and provides simple
          electricity-saving recommendations to help reduce consumption.
        </p>

        <div style={{ marginTop: "14px" }}>
          <button onClick={() => navigate("/recommendations")}>
            View Recommendations
          </button>
        </div>
      </Card>

      <Card title="Safety Reminder">
        <p>
          Do not touch fallen wires or damaged power lines. Submit a damage
          report immediately and wait for authorized repair personnel.
        </p>

        <div style={{ marginTop: "14px" }}>
          <button onClick={() => navigate("/reports")}>Report Damage</button>
        </div>
      </Card>
    </>
  );
}