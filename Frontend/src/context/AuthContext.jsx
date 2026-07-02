import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

const USER_KEY = "sindhuswap_user";
const USER_TOKEN_KEY = "sindhuswap_user_token";
const ADMIN_KEY = "sindhuswap_admin";
const ADMIN_TOKEN_KEY = "sindhuswap_admin_token";

const createDemoToken = (role) =>
  `${role}.${Date.now().toString(36)}.${Math.random().toString(36).slice(2)}`;

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
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [adminToken, setAdminToken] = useState(null);

  useEffect(() => {
    setUser(readStoredJson(USER_KEY));
    setAdmin(readStoredJson(ADMIN_KEY));
    setUserToken(localStorage.getItem(USER_TOKEN_KEY));
    setAdminToken(localStorage.getItem(ADMIN_TOKEN_KEY));
  }, []);

  const loginUser = async ({ email, password }) => {
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    const nextUser = {
      id: "user-demo",
      name: email.split("@")[0] || "SindhuSwap User",
      email,
      role: "user",
      avatar: (email[0] || "S").toUpperCase(),
    };
    const token = createDemoToken("user");

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

    if (username !== "admin" || password !== "12345") {
      throw new Error("Invalid administrator credentials.");
    }

    const nextAdmin = {
      id: "admin-demo",
      name: "Administrator",
      username,
      role: "admin",
    };
    const token = createDemoToken("admin");

    localStorage.setItem(ADMIN_KEY, JSON.stringify(nextAdmin));
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
    localStorage.setItem("adminAuth", "true");
    setAdmin(nextAdmin);
    setAdminToken(token);
    return nextAdmin;
  };

  const registerUser = async ({ name, email, mobile, password }) => {
    if (!name || !email || !mobile || !password) {
      throw new Error("Please complete all required fields.");
    }

    localStorage.setItem(
      "sindhuswap_last_registered_user",
      JSON.stringify({ name, email, mobile, role: "user" })
    );
    return true;
  };

  const logoutUser = () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(USER_TOKEN_KEY);
    localStorage.removeItem("userAuth");
    setUser(null);
    setUserToken(null);
  };

  const logoutAdmin = () => {
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
