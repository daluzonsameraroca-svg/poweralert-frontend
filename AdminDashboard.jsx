import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import { getAdminDashboardStats } from "../../api/dashboardApi";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total_users: 0,
    total_interruptions: 0,
    active_interruptions: 0,
    pending_reports: 0,
    unpaid_bills: 0,
  });

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 5000);
    return () => clearInterval(interval);
  }, []);

  async function loadStats() {
    try {
      const res = await getAdminDashboardStats();
      setStats(res.data);
    } catch (error) {
      console.log("Failed to load admin dashboard", error);
    }
  }

  return (
    <>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Monitor consumers, interruptions, reports, and bills."
      />

      <div className="cards-grid">
        <div
          className="dashboard-card-link"
          onClick={() => navigate("/admin/users")}
        >
          <Card title="Total Consumers">
            <h2>{stats.total_users}</h2>
            <p>Registered consumer accounts</p>
          </Card>
        </div>

        <div
          className="dashboard-card-link"
          onClick={() => navigate("/admin/interruptions")}
        >
          <Card title="Total Interruptions">
            <h2>{stats.total_interruptions}</h2>
            <p>All posted power interruptions</p>
          </Card>
        </div>

        <div
          className="dashboard-card-link"
          onClick={() => navigate("/admin/interruptions")}
        >
          <Card title="Active Interruptions">
            <h2>{stats.active_interruptions}</h2>
            <p>Ongoing or scheduled interruptions</p>
          </Card>
        </div>

        <div
          className="dashboard-card-link"
          onClick={() => navigate("/admin/reports")}
        >
          <Card title="Pending Reports">
            <h2>{stats.pending_reports}</h2>
            <p>Damage reports needing action</p>
          </Card>
        </div>

        <div
          className="dashboard-card-link"
          onClick={() => navigate("/admin/bills")}
        >
          <Card title="Unpaid Bills">
            <h2>{stats.unpaid_bills}</h2>
            <p>Unpaid consumer bills</p>
          </Card>
        </div>
      </div>

      <Card title="Admin Control Center">
        <p>
          From here, admins can post interruptions, update restoration progress,
          manage reports, create bills, publish announcements, and notify
          affected users.
        </p>
      </Card>
    </>
  );
}