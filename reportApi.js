import api from "./axios";

export function getReports() {
  return api.get("/reports");
}

export function createReport(data) {
  return api.post("/reports", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function updateReportStatus(id, status) {
  return api.put(`/reports/${id}/status`, { status });
}