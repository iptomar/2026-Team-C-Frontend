import { useNavigate } from "react-router-dom";
import "../css/DashboardPage.css";

const navItems = [
  {
    key: "dashboard",
    label: "Dashboard",
    active: true,
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
    active: false,
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

const actions = [
  {
    key: "create",
    label: "Criar formulário",
    description: "Cria um novo formulário para alteração de aulas ou outros pedidos.",
    className: "primary",
    path: "/criar-formulario",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
  },
  {
    key: "myforms",
    label: "Os meus formulários",
    description: "Consulta e gere os formulários que já criaste.",
    className: "",
    path: "/meus-formularios",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="16" y2="17" />
      </svg>
    ),
  },
];

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">

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
          {navItems.map(({ key, label, active, path, icon }) => (
            <button
              key={key}
              className={`sidebar-item ${active ? "active" : ""}`}
              onClick={() => path && navigate(path)}
            >
              {icon}
              {label}
            </button>
          ))}
        </nav>

        <div className="sidebar-logout">
          <button className="sidebar-item" onClick={() => navigate("/login")}>
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
      <div className="dashboard-main">

        {/* Topbar */}
        <header className="dashboard-topbar">
          <span className="topbar-title">Dashboard</span>
          <div className="topbar-user">
            <div className="topbar-avatar">D</div>
            <div className="topbar-user-info">
              <span className="topbar-user-name">Docente</span>
              <span className="topbar-user-role">Área do Docente</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="dashboard-content">
          <div className="dashboard-welcome">
            <h1>Bem-vindo 👋</h1>
            <p>O que pretende fazer hoje?</p>
          </div>

          <div className="dashboard-actions">
            {actions.map(({ key, label, description, className, path, icon }) => (
              <button
                key={key}
                className={`action-card ${className}`}
                onClick={() => navigate(path)}
                aria-label={label}
              >
                <div className="action-card-top">
                  <div className="action-card-icon">{icon}</div>
                  <div className="action-card-arrow"><ArrowIcon /></div>
                </div>
                <div>
                  <h2>{label}</h2>
                  <p>{description}</p>
                </div>
              </button>
            ))}
          </div>
        </main>

      </div>
    </div>
  );
}