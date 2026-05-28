import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../utils/session";

export default function AdminRoute({ children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (getUserRole() !== "ADMIN") {
    return <Navigate to="/inicio" replace />;
  }

  return children;
}
