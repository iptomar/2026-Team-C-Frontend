import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, getUser, removeToken } from "../utils/session";
import "../css/UserDashboardPage.css";

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

export default function UserDashboardPage() {
  const navigate = useNavigate();
  const user = getUser();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/forms?archived=false", { headers: authHeaders() })
      .then((r) => r.json())
      .then((data) => setForms(Array.isArray(data) ? data : []))
      .catch(() => setForms([]))
      .finally(() => setLoading(false));
  }, []);

  function handleLogout() {
    fetch("/api/auth/logout", { method: "POST", headers: authHeaders() }).finally(() => {
      removeToken();
      navigate("/login");
    });
  }

  return (
    <div className="udash-container">

      {/* Sidebar */}
      <aside className="udash-sidebar">
        <div className="udash-brand">
          <div className="udash-brand-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <span>FormDocs</span>
        </div>

        <nav className="udash-nav">
          <button className="udash-nav-item active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            Dashboard
          </button>
          <button className="udash-nav-item" onClick={() => navigate("/inicio/preenchimentos")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="16" y2="17" />
            </svg>
            Os meus preenchimentos
          </button>
        </nav>

        <div className="udash-sidebar-bottom">
          <button className="udash-nav-item" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Terminar sessão
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="udash-main">

        {/* Topbar */}
        <header className="udash-topbar">
          <span className="udash-topbar-title">Dashboard</span>
          <div className="udash-topbar-user">
            <div className="udash-avatar">{user?.email?.[0]?.toUpperCase() || "U"}</div>
            <div className="udash-user-info">
              <span className="udash-user-name">{user?.email || "Utilizador"}</span>
              <span className="udash-user-role">Utilizador</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="udash-content">
          <div className="udash-welcome">
            <h1>Bem-vindo 👋</h1>
            <p>Escolhe um formulário para preencher ou consulta os teus preenchimentos.</p>
          </div>

          <div className="udash-actions">
            <button className="udash-action-card primary" onClick={() => document.getElementById("forms-section").scrollIntoView({ behavior: "smooth" })}>
              <div className="udash-action-top">
                <div className="udash-action-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="16" y2="17" />
                  </svg>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
              </div>
              <div>
                <h2>Formulários disponíveis</h2>
                <p>Vê e preenche os formulários disponibilizados.</p>
              </div>
            </button>

            <button className="udash-action-card" onClick={() => navigate("/inicio/preenchimentos")}>
              <div className="udash-action-top">
                <div className="udash-action-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 11 12 14 22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
              </div>
              <div>
                <h2>Os meus preenchimentos</h2>
                <p>Consulta os formulários que submeteste ou tens em rascunho.</p>
              </div>
            </button>
          </div>

          {/* Formulários disponíveis */}
          <section id="forms-section" className="udash-forms-section">
            <h2 className="udash-section-title">Formulários disponíveis</h2>

            {loading ? (
              <p className="udash-empty">A carregar formulários...</p>
            ) : forms.length === 0 ? (
              <p className="udash-empty">Não há formulários disponíveis de momento.</p>
            ) : (
              <div className="udash-forms-list">
                {forms.map((form) => (
                  <div key={form.id} className="udash-form-card">
                    <div className="udash-form-card-left">
                      <div className="udash-form-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="16" y2="17" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="udash-form-name">{form.name}</h3>
                        <p className="udash-form-meta">Disponível desde {new Date(form.createdAt).toLocaleDateString("pt-PT")}</p>
                      </div>
                    </div>
                    <button className="udash-fill-btn" onClick={() => navigate(`/preencher/${form.id}`)}>
                      Preencher
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
