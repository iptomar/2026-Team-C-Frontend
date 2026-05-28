import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../utils/session";

export default function UserRoute({ children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (getUserRole() !== "USER") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
