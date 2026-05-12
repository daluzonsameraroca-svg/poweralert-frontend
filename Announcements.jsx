import { useEffect, useState } from "react";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import { getAnnouncements } from "../../api/announcementApi";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);

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

  return (
    <>
      <PageHeader
        title="Announcements"
        subtitle="Official updates and public advisories from the electric company."
      />

      {announcements.length === 0 ? (
        <Card title="No Announcements">
          <p>No announcements available.</p>
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