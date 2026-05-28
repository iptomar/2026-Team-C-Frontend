import "../css/UserPage.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, getUserRole, removeToken } from "../utils/session";

const navItems = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    icon: (
      <svg className="sidebar-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    key: "myforms",
    label: "Os meus formulários",
    path: "/meus-formularios",
    icon: (
      <svg className="sidebar-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="16" y2="17" />
      </svg>
    ),
  },
];

function roleLabel(role) {
  if (role === "ADMIN") return "Administrador";
  if (role === "DOCENTE") return "Docente";
  return "Utilizador";
}

export default function UserPage() {
  const navigate = useNavigate();
  const user = getUser()?.user;

  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  }

  async function resetPass(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setError("Preencha todos os campos.");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      setError("A nova palavra-passe e a confirmação não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getUser()?.token}`,
        },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Erro ao alterar a palavra-passe.");
      }

      setSuccess("Palavra-passe alterada. Será redirecionado para o login...");
      setPasswords({ current: "", new: "", confirm: "" });

      setTimeout(() => {
        removeToken();
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  return (
    <div className="userpage-container">

      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <span>FormDocs</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ key, label, path, icon }) => (
            <button
              key={key}
              className="sidebar-item"
              onClick={() => navigate(path)}
            >
              {icon}
              {label}
            </button>
          ))}
        </nav>

        <div className="sidebar-logout">
          <button
            className="sidebar-item"
            onClick={() => { removeToken(); navigate("/login"); }}
          >
            <svg className="sidebar-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Terminar sessão
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="userpage-main">

        {/* Topbar */}
        <header className="dashboard-topbar">
          <span className="topbar-title">Perfil</span>
          <div className="topbar-user">
            <div className="topbar-avatar">{initials}</div>
            <div className="topbar-user-info">
              <span className="topbar-user-name">{user?.name || "Utilizador"}</span>
              <span className="topbar-user-role">{roleLabel(user?.role)}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="userpage-content">
          <div className="userpage-heading">
            <h1>O meu perfil</h1>
            <p>Consulte os seus dados e gerencie a sua conta.</p>
          </div>

          {/* Profile info card */}
          <div className="profile-card">
            <div className="profile-avatar-large">{initials}</div>
            <div className="profile-details">
              <span className="profile-name">{user?.name || "N/A"}</span>
              <span className="profile-email">{user?.email || "N/A"}</span>
              <span className="profile-role-badge">{roleLabel(user?.role)}</span>
            </div>
          </div>

          {/* Password change card */}
          <div className="password-card">
            <p className="card-section-title">Alterar palavra-passe</p>
            <p className="card-section-subtitle">
              Após guardar, a sua sessão será terminada e terá de iniciar sessão novamente.
            </p>

            <form onSubmit={resetPass} className="password-form">
              <div className="form-field">
                <label htmlFor="current">Palavra-passe atual</label>
                <input
                  id="current"
                  type="password"
                  name="current"
                  placeholder="••••••••"
                  value={passwords.current}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <hr className="form-divider" />

              <div className="form-field">
                <label htmlFor="new">Nova palavra-passe</label>
                <input
                  id="new"
                  type="password"
                  name="new"
                  placeholder="••••••••"
                  value={passwords.new}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-field">
                <label htmlFor="confirm">Confirmar nova palavra-passe</label>
                <input
                  id="confirm"
                  type="password"
                  name="confirm"
                  placeholder="••••••••"
                  value={passwords.confirm}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              {error && <p className="form-message error">{error}</p>}
              {success && <p className="form-message success">{success}</p>}

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? "A guardar..." : "Guardar alterações"}
                </button>
              </div>
            </form>
          </div>
        </main>

      </div>
    </div>
  );
}