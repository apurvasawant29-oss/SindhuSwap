import api from "./client";

export const wishlistApi = {
  list: () => api.get("/wishlist"),
  add: (productId) => api.post(`/wishlist/${productId}`),
  remove: (productId) => api.delete(`/wishlist/${productId}`),
};
