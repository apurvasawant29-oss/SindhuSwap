import { Navigate, Outlet } from "react-router-dom";

function AdminRoute() {
  const isAdminAuth = localStorage.getItem("adminAuth") === "true";
  return isAdminAuth ? <Outlet /> : <Navigate to="/login" replace />;
}

export default AdminRoute;
