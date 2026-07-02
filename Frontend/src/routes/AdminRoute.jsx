import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute() {
  const { isAdminAuthenticated } = useAuth();
  return isAdminAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export default AdminRoute;
