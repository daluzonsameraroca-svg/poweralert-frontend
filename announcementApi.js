import api from "./axios";

export function getAnnouncements() {
  return api.get("/announcements");
}

export function createAnnouncement(data) {
  return api.post("/announcements", data);
}