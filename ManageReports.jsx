import { useEffect, useState } from "react";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import { getReports, updateReportStatus } from "../../api/reportApi";

import Toast from "../../components/common/Toast";


export default function ManageReports() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    try {
      const res = await getReports();
      setReports(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log("Failed to load reports", error);
    }
  }

  async function changeStatus(id, status) {
    try {
      const res = await updateReportStatus(id, status);
      setToast({
  type: "success",
  title: "Status Updated",
  message: res.data.message || "Report status updated successfully.",
});
      loadReports();
    } catch (error) {
      setToast({
  type: "error",
  title: "Update Failed",
  message: error.response?.data?.message || "Failed to update report status.",
});
    }
  }

  const filteredReports = reports.filter((report) => {
    const text = `
      ${report.description || ""}
      ${report.region || ""}
      ${report.province || ""}
      ${report.municipality || ""}
      ${report.barangay || ""}
      ${report.status || ""}
    `.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <>
      <PageHeader
        title="Manage Damage Reports"
        subtitle="Review submitted reports and update repair status."
      />

      <Card title="Search Reports">
        <input
          placeholder="Search by area, description, or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Card>

      {filteredReports.length === 0 ? (
        <Card title="No Reports">
          <p>No damage reports found.</p>
        </Card>
      ) : (
        filteredReports.map((report) => (
          <Card key={report.report_id} title={`Report #${report.report_id}`}>
            <p>
              <strong>Description:</strong> {report.description}
            </p>

            <p>
              <strong>Area:</strong> {report.region}, {report.province},{" "}
              {report.municipality}, {report.barangay}
            </p>

            {report.image_path && (
              <img
                className="report-image"
                src={`http://127.0.0.1:8000/storage/${report.image_path}`}
                alt="Damage report"
              />
            )}

            <div style={{ marginTop: "14px" }}>
              <StatusBadge status={report.status} />
            </div>

            <div className="admin-actions">
              <select
                value={report.status || "Pending"}
                onChange={(e) => changeStatus(report.report_id, e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Under Review">Under Review</option>
                <option value="Repair Team Assigned">
                  Repair Team Assigned
                </option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </Card>
        ))
      )}
    </>
  );
}