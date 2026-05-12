import api from "./axios";

export function getAllInterruptions() {
  return api.get("/interruptions");
}

export function getUserInterruptions(userId) {
  return api.get(`/user/interruptions/${userId}`);
}

export function createInterruption(data) {
  return api.post("/interruptions", data);
}

export function updateInterruptionStatus(id, status) {
  return api.put(`/interruptions/${id}/status`, { status });
}

export function deleteInterruption(id) {
  return api.delete(`/interruptions/${id}`);
}

export function getInterruptionUpdates(id) {
  return api.get(`/interruptions/${id}/updates`);
}

export function addInterruptionUpdate(id, update_message) {
  return api.post(`/interruptions/${id}/updates`, { update_message });
}