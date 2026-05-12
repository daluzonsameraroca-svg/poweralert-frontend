import { useEffect, useState } from "react";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import {
  getUserInterruptions,
  getInterruptionUpdates,
} from "../../api/interruptionApi";

export default function Interruptions() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [interruptions, setInterruptions] = useState([]);
  const [updates, setUpdates] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.user_id) return;

    loadInterruptions();

    const interval = setInterval(loadInterruptions, 5000);

    return () => clearInterval(interval);
  }, []);

  async function loadInterruptions() {
    try {
      const res = await getUserInterruptions(user.user_id);
      const data = Array.isArray(res.data) ? res.data : [];

      setInterruptions(data);

      data.forEach((item) => {
        loadUpdates(item.interruption_id);
      });
    } catch (error) {
      console.log("Failed to load user interruptions:", error.response?.data || error);
      setInterruptions([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadUpdates(interruptionId) {
    try {
      const res = await getInterruptionUpdates(interruptionId);

      setUpdates((prev) => ({
        ...prev,
        [interruptionId]: Array.isArray(res.data) ? res.data : [],
      }));
    } catch (error) {
      console.log("Failed to load timeline updates:", error.response?.data || error);
    }
  }

  return (
    <>
      <PageHeader
        title="Power Interruptions"
        subtitle={`View scheduled and ongoing interruptions for ${
          user?.barangay || "your area"
        }, ${user?.municipality || ""}.`}
      />

      {loading ? (
        <Card title="Loading">
          <p>Loading interruptions...</p>
        </Card>
      ) : interruptions.length === 0 ? (
        <Card title="No Area Interruptions">
          <p>No active or scheduled interruption found for your area.</p>
        </Card>
      ) : (
        interruptions.map((item) => (
          <Card key={item.interruption_id} title={item.title}>
            <p>
              <strong>Reason:</strong> {item.reason}
            </p>

            <p>
              <strong>Area:</strong> {item.region}, {item.province},{" "}
              {item.municipality}, {item.barangay}
            </p>

            <p>
              <strong>Start:</strong> {item.start_datetime}
            </p>

            <p>
              <strong>Expected Restoration:</strong>{" "}
              {item.expected_restore_datetime}
            </p>

            <StatusBadge status={item.status} />

            <div className="timeline-box">
              <h4>Restoration Timeline</h4>

              {updates[item.interruption_id]?.length > 0 ? (
                updates[item.interruption_id].map((update) => (
                  <div className="timeline-item" key={update.update_id}>
                    <p>{update.update_message}</p>
                    <small>{update.created_at}</small>
                  </div>
                ))
              ) : (
                <p>No timeline updates yet.</p>
              )}
            </div>
          </Card>
        ))
      )}
    </>
  );
}