import api from "./client";

export const messageApi = {
  getContacts: () => api.get("/messages/contacts"),
  getMessages: (contactId) => api.get(`/messages/${contactId}`),
  sendMessage: (payload) => api.post("/messages", payload),
  deleteMessage: (id) => api.delete(`/messages/${id}`),
};
