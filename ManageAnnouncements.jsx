import { useEffect, useState } from "react";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import {
  getAnnouncements,
  createAnnouncement,
} from "../../api/announcementApi";

export default function ManageAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    message: "",
  });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function loadAnnouncements() {
    try {
      const res = await getAnnouncements();
      setAnnouncements(Array.isArray(res.data) ? res.data : []);
    } catch {
      setAnnouncements([]);
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
    setMessage("");

    try {
      const res = await createAnnouncement(form);

      if (res.data.status === "success") {
        setMessage(res.data.message || "Announcement posted successfully.");
        setForm({ title: "", message: "" });
        loadAnnouncements();
      } else {
        setMessage(res.data.message || "Failed to post announcement.");
      }
    } catch {
      setMessage("Failed to post announcement.");
    }
  }

  return (
    <>
      <PageHeader
        title="Manage Announcements"
        subtitle="Post centralized updates and advisories for all users."
      />

      <Card title="Post Announcement">
        {message && <div className="auth-message">{message}</div>}

        <form className="admin-form" onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Announcement title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <textarea
            name="message"
            placeholder="Announcement message"
            value={form.message}
            onChange={handleChange}
            required
          />

          <button type="submit">Post Announcement</button>
        </form>
      </Card>

      {announcements.length === 0 ? (
        <Card title="No Announcements">
          <p>No announcements posted yet.</p>
        </Card>
      ) : (
        announcements.map((item) => (
          <Card key={item.announcement_id} title={item.title}>
            <p>{item.message}</p>
            <small>{item.created_at}</small>
          </Card>
        ))
      )}
    </>
  );
}