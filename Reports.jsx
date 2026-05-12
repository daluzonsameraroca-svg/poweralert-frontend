import { useEffect, useState } from "react";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import LocationSelector from "../../components/forms/LocationSelector";
import { createReport, getReports } from "../../api/reportApi";

export default function Reports() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [reports, setReports] = useState([]);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    user_id: user?.user_id || "",
    description: "",
    region: user?.region || "",
    province: user?.province || "",
    municipality: user?.municipality || "",
    barangay: user?.barangay || "",
    region_code: user?.region_code || "",
    province_code: user?.province_code || "",
    municipality_code: user?.municipality_code || "",
    barangay_code: user?.barangay_code || "",
    image: null,
  });

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    try {
      const res = await getReports();
      const data = Array.isArray(res.data) ? res.data : [];

      setReports(data.filter((item) => item.user_id === user?.user_id));
    } catch (error) {
      console.log("Failed to load reports", error);
    }
  }

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function handleImageChange(e) {
    const file = e.target.files[0];

    if (!file) return;

    setForm((prev) => ({
      ...prev,
      image: file,
    }));

    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        if (form[key] !== null && form[key] !== "") {
          formData.append(key, form[key]);
        }
      });

      const res = await createReport(formData);

      if (res.data.status === "success") {
        setMessage(res.data.message || "Report submitted successfully.");

        setForm((prev) => ({
          ...prev,
          description: "",
          image: null,
        }));

        setPreview(null);
        loadReports();
      } else {
        setMessage(res.data.message || "Failed to submit report.");
      }
    } catch (error) {
      console.log("REPORT ERROR:", error.response?.data || error);
      setMessage(error.response?.data?.message || "Failed to submit report.");
    }
  }

  return (
    <>
      <PageHeader
        title="Damage Reports"
        subtitle="Submit and track power line damage reports."
      />

      <Card title="Submit Damage Report">
        {message && <div className="auth-message">{message}</div>}

        <form className="admin-form" onSubmit={handleSubmit}>
          <textarea
            name="description"
            placeholder="Describe the damage..."
            value={form.description}
            onChange={handleChange}
            required
          />

          <LocationSelector form={form} setForm={setForm} />

          <input type="file" accept="image/*" onChange={handleImageChange} />

          {preview && (
            <div className="preview-box">
              <p>Image Preview</p>
              <img src={preview} alt="Report preview" />
            </div>
          )}

          <button type="submit">Submit Report</button>
        </form>
      </Card>

      {reports.length === 0 ? (
        <Card title="No Reports">
          <p>You have not submitted any damage report yet.</p>
        </Card>
      ) : (
        reports.map((report) => (
          <Card key={report.report_id} title={`Report #${report.report_id}`}>
            <p>{report.description}</p>

            <p>
              <strong>Area:</strong> {report.municipality}, {report.barangay}
            </p>

            {report.image_path && (
              <img
                className="report-image"
                src={`http://127.0.0.1:8000/storage/${report.image_path}`}
                alt="Damage report"
              />
            )}

            <StatusBadge status={report.status} />
          </Card>
        ))
      )}
    </>
  );
}