import api from "./client";

export const contactApi = {
  create: (payload) => api.post("/contact", payload),
  list: () => api.get("/contact", { headers: { "x-admin-request": "true" } }),
  markRead: (id) => api.patch(`/contact/${id}/read`, {}, { headers: { "x-admin-request": "true" } }),
  remove: (id) => api.delete(`/contact/${id}`, { headers: { "x-admin-request": "true" } }),
};
