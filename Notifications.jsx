import { useEffect, useState } from "react";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import {
  getNotifications,
  markNotificationsAsRead,
} from "../../api/notificationApi";



export default function Notifications() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.user_id) return;

    loadNotifications();

    const interval = setInterval(loadNotifications, 5000);

    return () => clearInterval(interval);
  }, []);

  async function loadNotifications() {
    try {
      const res = await getNotifications(user.user_id);
      setNotifications(res.data);
    } catch (error) {
      console.log("Failed to load notifications", error);
    } finally {
      setLoading(false);
    }

    await markNotificationsAsRead(user.user_id);

  }

  return (
    <>
      <PageHeader
        title="Notifications"
        subtitle="View interruption alerts, restoration updates, bill reminders, and announcements."
      />

      {loading ? (
        <Card title="Loading">
          <p>Loading notifications...</p>
        </Card>
      ) : notifications.length === 0 ? (
        <Card title="No Notifications">
          <p>No notifications available for your area yet.</p>
        </Card>
      ) : (
        notifications.map((item) => (
          <Card key={item.notification_id} title={item.title}>
            <p>{item.message}</p>

            {item.municipality && (
              <p>
                <strong>Area:</strong> {item.municipality}
                {item.barangay ? `, ${item.barangay}` : ""}
              </p>
            )}

            <small>{item.created_at}</small>
          </Card>
        ))
      )}
    </>
  );
}