import api from "./client";

export const messageApi = {
  getContacts: () => api.get("/messages/conversations"),
  getConversations: () => api.get("/messages/conversations"),
  startConversation: (payload) => api.post("/messages/conversations", payload),
  getMessages: (conversationId) => api.get(`/messages/conversations/${conversationId}`),
  sendMessage: (payload) => api.post("/messages", payload),
  deleteMessage: (id) => api.delete(`/messages/${id}`),
};
