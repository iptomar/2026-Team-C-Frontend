import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../utils/session";

export default function UserRoute({ children }) {
  const location = useLocation();
  const [redirect, setRedirect] = useState(false);

  const authenticated = isAuthenticated();
  const role = getUserRole();
  const denied = authenticated && role !== "USER";

  useEffect(() => {
    if (denied) {
      const timer = setTimeout(() => setRedirect(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [denied]);

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (denied) {
    if (redirect) return <Navigate to="/dashboard" replace />;

    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#f9fafb",
        fontFamily: "Inter, system-ui, sans-serif",
      }}>
        <div style={{
          background: "#fff",
          border: "1.5px solid #fee2e2",
          borderRadius: "14px",
          padding: "40px 48px",
          textAlign: "center",
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          maxWidth: "360px",
        }}>
          <div style={{
            width: "52px",
            height: "52px",
            background: "#fee2e2",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#111827", margin: "0 0 8px" }}>
            Acesso negado
          </h2>
          <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 16px", lineHeight: "1.5" }}>
            Não tens permissão para aceder a esta página.
          </p>
          <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>
            A redirecionar...
          </p>
        </div>
      </div>
    );
  }

  return children;
}
