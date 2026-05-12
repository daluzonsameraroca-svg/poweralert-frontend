import api from "./axios";

export function getUserDashboard(userId) {
  return api.get(`/user-dashboard/${userId}`);
}

export function getAdminDashboardStats() {
  return api.get("/dashboard-stats");
}