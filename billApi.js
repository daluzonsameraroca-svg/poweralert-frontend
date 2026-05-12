import api from "./axios";

export function getUserBills(userId) {
  return api.get(`/user/${userId}/bills`);
}

export function getAllBills() {
  return api.get("/bills");
}

export function createBill(data) {
  return api.post("/bills", data);
}

export function payBill(id) {
  return api.post(`/bills/${id}/pay`);
}

export function getRecommendations(userId) {
  return api.get(`/user/${userId}/recommendations`);
}