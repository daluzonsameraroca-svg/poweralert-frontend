export default function AdminSidebar({ setPage }) {
  return (
    <aside className="sidebar admin-sidebar">

      <div className="brand">
      <img src="C:\xampp\htdocs\poweralert-framework\frontend\src\assets\logo.png"  />
      <h2>ElectroPulse</h2>
    </div>

      <button onClick={() => setPage("adminDashboard")}>
        Dashboard
      </button>

      <button onClick={() => setPage("manageInterruptions")}>
        Manage Interruptions
      </button>

      <button onClick={() => setPage("manageReports")}>
        Manage Reports
      </button>

      <button onClick={() => setPage("manageBills")}>
        Manage Bills
      </button>

      <button onClick={() => setPage("manageUsers")}>
        Manage Users
      </button>

      <button onClick={() => setPage("manageAnnouncements")}>
        Announcements
      </button>

      <button onClick={() => setPage("activityLogs")}>
        Activity Logs
      </button>

      <button
        onClick={() => {
          localStorage.removeItem("role");
          localStorage.removeItem("user");
          setPage("login");
        }}
      >
        Logout
      </button>

    </aside>
  );
}