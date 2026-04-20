import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../utils/session";

export default function PrivateRoute({ children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}
