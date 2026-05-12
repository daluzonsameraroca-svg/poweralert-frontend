import { useEffect, useState } from "react";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import api from "../../api/axios";

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    try {
      const res = await api.get("/activity-logs");
      setLogs(Array.isArray(res.data) ? res.data : []);
    } catch {
      setLogs([]);
    }
  }

  return (
    <>
      <PageHeader
        title="Activity Logs"
        subtitle="Track important system actions and updates."
      />

      {logs.length === 0 ? (
        <Card title="No Logs">
          <p>No activity logs available.</p>
        </Card>
      ) : (
        logs.map((log) => (
          <Card key={log.log_id} title={log.action}>
            <p>{log.description}</p>

            <p>
              <strong>User:</strong>{" "}
              {log.first_name
                ? `${log.first_name} ${log.last_name}`
                : `User #${log.user_id || "System"}`}
            </p>

            <small>{log.created_at}</small>
          </Card>
        ))
      )}
    </>
  );
}