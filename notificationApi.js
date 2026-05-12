import api from "./axios";

export function getNotifications(userId) {
  return api.get(`/notifications/${userId}`);
}

export function getNotificationCount(userId) {
  return api.get(`/notifications/${userId}/count`);
}

export function markNotificationsAsRead(userId) {
  return api.put(`/notifications/${userId}/read`);
}