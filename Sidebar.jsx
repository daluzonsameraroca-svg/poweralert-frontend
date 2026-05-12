import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Zap,
  FileWarning,
  Receipt,
  Bell,
  Megaphone,
  Lightbulb,
  User,
  Users,
  ClipboardList,
  Activity,
  LogOut,
} from "lucide-react";
import Logo from "../common/Logo";
import { Settings } from "lucide-react";


export default function Sidebar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || "user";

  const userLinks = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/interruptions", label: "Interruptions", icon: Zap },
    { to: "/reports", label: "Report Damage", icon: FileWarning },
    { to: "/bills", label: "Bills & Receipts", icon: Receipt },
    { to: "/notifications", label: "Notifications", icon: Bell },
    { to: "/announcements", label: "Announcements", icon: Megaphone },
    { to: "/recommendations", label: "Recommendations", icon: Lightbulb },
    { to: "/profile", label: "Profile", icon: User },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  const adminLinks = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/interruptions", label: "Manage Interruptions", icon: Zap },
    { to: "/admin/reports", label: "Manage Reports", icon: ClipboardList },
    { to: "/admin/bills", label: "Manage Bills", icon: Receipt },
    { to: "/admin/users", label: "Manage Users", icon: Users },
    { to: "/admin/announcements", label: "Announcements", icon: Megaphone },
    { to: "/admin/activity-logs", label: "Activity Logs", icon: Activity },
  ];

  const links = role === "admin" ? adminLinks : userLinks;

  function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
      <Logo
    size="sm"
    subtitle={role === "admin" ? "Admin Panel" : "User Portal"}
  />
    </div>
      

      <nav className="sidebar-nav">
        {links.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <button className="logout-btn" onClick={logout}>
        <LogOut size={19} />
        <span>Logout</span>
      </button>
    </aside>
  );
}