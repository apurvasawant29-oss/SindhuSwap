import api from "./client";

export const productApi = {
  list: (params) => api.get("/products", { params }),
  details: (id) => api.get(`/products/${id}`),
  create: (payload) => api.post("/products", payload),
  update: (id, payload) => api.put(`/products/${id}`, payload),
  remove: (id) => api.delete(`/products/${id}`),
  mine: (params) => api.get("/products/mine", { params }),
  requestSwap: (id, payload = {}) => api.post(`/products/${id}/swap-requests`, payload),
};
