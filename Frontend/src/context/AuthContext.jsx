import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/authApi";
import { ADMIN_TOKEN_KEY, USER_TOKEN_KEY } from "../api/client";

const AuthContext = createContext(null);

const USER_KEY = "sindhuswap_user";
const ADMIN_KEY = "sindhuswap_admin";

function readStoredJson(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredJson(USER_KEY));
  const [admin, setAdmin] = useState(() => readStoredJson(ADMIN_KEY));
  const [userToken, setUserToken] = useState(() => localStorage.getItem(USER_TOKEN_KEY));
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem(ADMIN_TOKEN_KEY));

  useEffect(() => {
    const handleInvalidAuth = () => {
      setUser(null);
      setAdmin(null);
      setUserToken(null);
      setAdminToken(null);
    };

    window.addEventListener("sindhuswap-auth-invalid", handleInvalidAuth);
    return () => window.removeEventListener("sindhuswap-auth-invalid", handleInvalidAuth);
  }, []);

  const loginUser = async ({ email, password }) => {
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    const response = await authApi.login({ email, password });
    const nextUser = response.data.user;
    const token = response.data.token;

    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    localStorage.setItem(USER_TOKEN_KEY, token);
    localStorage.setItem("userAuth", "true");
    setUser(nextUser);
    setUserToken(token);
    return nextUser;
  };

  const loginAdmin = async ({ username, password }) => {
    if (!username || !password) {
      throw new Error("Admin username and password are required.");
    }

    const response = await authApi.adminLogin({ username, password });
    const nextAdmin = response.data.user;
    const token = response.data.token;

    localStorage.setItem(ADMIN_KEY, JSON.stringify(nextAdmin));
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
    localStorage.setItem("adminAuth", "true");
    setAdmin(nextAdmin);
    setAdminToken(token);
    return nextAdmin;
  };

  const registerUser = async ({ name, email, mobile, password, taluka }) => {
    if (!name || !email || !mobile || !password) {
      throw new Error("Please complete all required fields.");
    }

    const response = await authApi.register({
      fullName: name,
      email,
      phone: mobile,
      password,
      taluka,
    });

    const nextUser = response.data.user;
    const token = response.data.token;

    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    localStorage.setItem(USER_TOKEN_KEY, token);
    localStorage.setItem("userAuth", "true");
    setUser(nextUser);
    setUserToken(token);

    return nextUser;
  };

  const logoutUser = async () => {
    await authApi.logout().catch(() => {});
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(USER_TOKEN_KEY);
    localStorage.removeItem("userAuth");
    setUser(null);
    setUserToken(null);
  };

  const logoutAdmin = async () => {
    await authApi.logout().catch(() => {});
    localStorage.removeItem(ADMIN_KEY);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem("adminAuth");
    setAdmin(null);
    setAdminToken(null);
  };

  const value = useMemo(
    () => ({
      user,
      admin,
      userToken,
      adminToken,
      isUserAuthenticated: Boolean(user && userToken),
      isAdminAuthenticated: Boolean(admin && adminToken),
      loginUser,
      loginAdmin,
      registerUser,
      logoutUser,
      logoutAdmin,
    }),
    [user, admin, userToken, adminToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

