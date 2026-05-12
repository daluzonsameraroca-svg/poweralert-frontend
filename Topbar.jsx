import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getNotificationCount } from "../../api/notificationApi";

export default function Topbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [count, setCount] = useState(0);

  const initials = user
    ? `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`
    : "U";

  useEffect(() => {
    if (!user?.user_id || user?.role !== "user") return;

    loadCount();

    const interval = setInterval(loadCount, 5000);

    return () => clearInterval(interval);
  }, []);

  async function loadCount() {
    try {
      const res = await getNotificationCount(user.user_id);
      setCount(res.data.count || 0);
    } catch {
      setCount(0);
    }
  }

  function openNotifications() {
    if (user?.role === "user") {
      navigate("/notifications");
    }
  }

  return (
    <header className="topbar">
      <div>
        <h1>Power Monitoring System</h1>

      </div>

      <div className="topbar-right">
        {user?.role === "user" && (
          <button className="icon-btn" onClick={openNotifications}>
            <Bell size={20} />
            {count > 0 && <span className="notif-count">{count}</span>}
          </button>
        )}

        <div className="user-info">
          <strong>
            {user ? `${user.first_name} ${user.last_name}` : "Guest"}
          </strong>
          <span>{user?.role || "visitor"}</span>
        </div>

        <div className="avatar">{initials}</div>
      </div>
    </header>
  );
}