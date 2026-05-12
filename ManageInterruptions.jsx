import { useEffect, useState } from "react";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import LocationSelector from "../../components/forms/LocationSelector";
import {
  getAllInterruptions,
  createInterruption,
  updateInterruptionStatus,
  deleteInterruption,
  addInterruptionUpdate,
} from "../../api/interruptionApi";
import Toast from "../../components/common/Toast";

const emptyForm = {
  title: "",
  reason: "",
  region: "",
  province: "",
  municipality: "",
  barangay: "",
  region_code: "",
  province_code: "",
  municipality_code: "",
  barangay_code: "",
  start_datetime: "",
  expected_restore_datetime: "",
  status: "Scheduled",
};

export default function ManageInterruptions() {
  const [form, setForm] = useState({ ...emptyForm });
  const [interruptions, setInterruptions] = useState([]);
  const [message, setMessage] = useState("");
  const [timelineInputs, setTimelineInputs] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadInterruptions();
  }, []);

  async function loadInterruptions() {
    try {
      const res = await getAllInterruptions();
      setInterruptions(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log("LOAD ERROR:", error.response?.data || error);
      setInterruptions([]);
    }
  }

  function handleChange(e) {
    setForm((prev) => ({
      ...(prev || {}),
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await createInterruption(form);

      if (res.data.status === "success") {
        setMessage(res.data.message || "Interruption posted and users notified.");
        await loadInterruptions();
        setForm({ ...emptyForm });
      } else {
        setMessage(res.data.message || "Failed to post interruption.");
      }
    } catch (error) {
      console.log("CREATE ERROR:", error.response?.data || error);
      setMessage(
        error.response?.data?.message ||
          "Failed to post interruption. Check database/API."
      );
    } finally {
      setLoading(false);
    }
  }

  async function changeStatus(id, status) {
    try {
      const res = await updateInterruptionStatus(id, status);
      setToast({
  type: "success",
  title: "Status Updated",
  message: res.data.message || "Interruption status updated successfully.",
});
      await loadInterruptions();
    } catch (error) {
      console.log("STATUS ERROR:", error.response?.data || error);
      setToast({
  type: "error",
  title: "Update Failed",
  message: "Failed to update interruption status.",
});
    }
  }

  async function removeInterruption(id) {
    if (!window.confirm("Delete this interruption?")) return;

    try {
      const res = await deleteInterruption(id);
      
      setToast({
  type: "success",
  title: "Interruption Deleted",
  message: res.data.message || "Interruption deleted successfully.",
});
      await loadInterruptions();
    } catch (error) {
      console.log("DELETE ERROR:", error.response?.data || error);
      setToast({
  type: "error",
  title: "Delete Failed",
  message: error.response?.data?.message || "Failed to delete interruption.",
});
    }
  }

  async function addTimeline(id) {
    const text = timelineInputs[id];

    if (!text || text.trim() === "") {
      alert("Please enter an update.");
      return;
    }

    try {
      const res = await addInterruptionUpdate(id, text);
      setToast({
  type: "success",
  title: "Update Added",
  message: res.data.message || "Timeline update added successfully.",
});

      setTimelineInputs((prev) => ({
        ...prev,
        [id]: "",
      }));

      await loadInterruptions();
    } catch (error) {
      console.log("TIMELINE ERROR:", error.response?.data || error);
      setToast({
  type: "error",
  title: "Add Update Failed",
  message: error.response?.data?.message || "Failed to add timeline update.",
});
    }
  }

  return (
    <>
      <PageHeader
        title="Manage Interruptions"
        subtitle="Create power interruptions, update status, and notify affected users."
      />
      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}

      <Card title="Create Power Interruption">
        {message && <div className="auth-message">{message}</div>}

        <form className="admin-form" onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Interruption title"
            value={form.title || ""}
            onChange={handleChange}
            required
          />

          <textarea
            name="reason"
            placeholder="Reason or details"
            value={form.reason || ""}
            onChange={handleChange}
            required
          />

          <LocationSelector form={form} setForm={setForm} />

          <div className="form-grid">
            <input
              type="datetime-local"
              name="start_datetime"
              value={form.start_datetime || ""}
              onChange={handleChange}
              required
            />

            <input
              type="datetime-local"
              name="expected_restore_datetime"
              value={form.expected_restore_datetime || ""}
              onChange={handleChange}
              required
            />
          </div>

          <select
            name="status"
            value={form.status || "Scheduled"}
            onChange={handleChange}
          >
            <option value="Scheduled">Scheduled</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Under Repair">Under Repair</option>
            <option value="Restored">Restored</option>
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "Posting..." : "Post Interruption"}
          </button>
        </form>
      </Card>

      {interruptions.length === 0 ? (
        <Card title="No Interruptions">
          <p>No interruptions posted yet.</p>
        </Card>
      ) : (
        interruptions.map((item) => (
          <Card key={item.interruption_id || item.id}>
            <div className="interruption-header">
              <div>
                <h3>{item.title || "Untitled Interruption"}</h3>
                <p>{item.reason || "No reason provided."}</p>
              </div>

              <StatusBadge status={item.status || "Scheduled"} />
            </div>

            <div className="interruption-info">
              <div className="info-box">
                <strong>Area</strong>
                <span>
                  {item.municipality || "N/A"}, {item.barangay || "N/A"}
                </span>
              </div>

              <div className="info-box">
                <strong>Start</strong>
                <span>{item.start_datetime || "N/A"}</span>
              </div>

              <div className="info-box">
                <strong>Expected Restoration</strong>
                <span>{item.expected_restore_datetime || "N/A"}</span>
              </div>
            </div>

            <div className="admin-actions">
              <select
                value={item.status || "Scheduled"}
                onChange={(e) =>
                  changeStatus(item.interruption_id, e.target.value)
                }
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Under Repair">Under Repair</option>
                <option value="Restored">Restored</option>
              </select>

              <button
                type="button"
                className="danger-btn"
                onClick={() => removeInterruption(item.interruption_id)}
              >
                Delete
              </button>
            </div>

            <div className="timeline-box">
              <h4>Add Timeline Update</h4>

              <textarea
                placeholder="Example: Repair team has arrived in the affected area."
                value={timelineInputs[item.interruption_id] || ""}
                onChange={(e) =>
                  setTimelineInputs((prev) => ({
                    ...prev,
                    [item.interruption_id]: e.target.value,
                  }))
                }
              />

              <button
                type="button"
                onClick={() => addTimeline(item.interruption_id)}
              >
                Add Update and Notify Users
              </button>
            </div>
          </Card>
        ))
      )}
    </>
  );
}