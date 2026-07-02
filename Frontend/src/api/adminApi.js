import api from "./client";

const adminHeaders = { "x-admin-request": "true" };

export const adminApi = {
  dashboard: () => api.get("/admin/dashboard", { headers: adminHeaders }),
  users: () => api.get("/admin/users", { headers: adminHeaders }),
  updateUser: (id, payload) => api.patch(`/admin/users/${id}`, payload, { headers: adminHeaders }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`, { headers: adminHeaders }),
  products: () => api.get("/admin/products", { headers: adminHeaders }),
  updateProduct: (id, payload) => api.patch(`/admin/products/${id}`, payload, { headers: adminHeaders }),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`, { headers: adminHeaders }),
  categories: () => api.get("/categories"),
  createCategory: (payload) => api.post("/categories", payload, { headers: adminHeaders }),
  updateCategory: (id, payload) => api.put(`/categories/${id}`, payload, { headers: adminHeaders }),
  deleteCategory: (id) => api.delete(`/categories/${id}`, { headers: adminHeaders }),
  reviews: () => api.get("/admin/reviews", { headers: adminHeaders }),
  reports: () => api.get("/admin/reports", { headers: adminHeaders }),
  swaps: () => api.get("/admin/swaps", { headers: adminHeaders }),
  notifications: () => api.get("/admin/notifications", { headers: adminHeaders }),
  wishlist: () => api.get("/admin/wishlist", { headers: adminHeaders }),
};
