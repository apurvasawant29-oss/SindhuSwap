import axios from "axios";

export const USER_TOKEN_KEY = "sindhuswap_user_token";
export const ADMIN_TOKEN_KEY = "sindhuswap_admin_token";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem(ADMIN_TOKEN_KEY);
  const userToken = localStorage.getItem(USER_TOKEN_KEY);
  const token = config.headers?.["x-admin-request"] ? adminToken : userToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  delete config.headers["x-admin-request"];
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.errors?.[0]?.message ||
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    if (error.response?.status === 401 && /token|unauthorized|expired/i.test(message)) {
      localStorage.removeItem(USER_TOKEN_KEY);
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem("sindhuswap_user");
      localStorage.removeItem("sindhuswap_admin");
      localStorage.removeItem("userAuth");
      localStorage.removeItem("adminAuth");
      window.dispatchEvent(new Event("sindhuswap-auth-invalid"));
    }

    return Promise.reject(new Error(message));
  }
);

export default api;

