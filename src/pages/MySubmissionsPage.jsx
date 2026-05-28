import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, removeToken } from "../utils/session";
import "../css/MySubmissionsPage.css";

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getUser()?.token}`,
  };
}

export default function MySubmissionsPage() {
  const navigate = useNavigate();
  const user = getUser()?.user;

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // "all" | "submitted" | "drafts"
  const [toast, setToast] = useState({ show: false, message: "", isError: false });
  const [confirmDelete, setConfirmDelete] = useState(null); // submission id to confirm

  useEffect(() => {
    loadSubmissions();
  }, []);

  async function loadSubmissions() {
    setLoading(true);
    try {
      const res = await fetch("/api/submissions", { headers: authHeaders() });
      if (!res.ok) throw new Error("Erro ao carregar preenchimentos");
      const data = await res.json();
      setSubmissions(Array.isArray(data) ? data : []);
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setLoading(false);
    }
  }

  function showToast(message, isError = false) {
    setToast({ show: true, message, isError });
    setTimeout(() => setToast({ show: false, message: "", isError: false }), 3000);
  }

  function handleLogout() {
    fetch("/api/auth/logout", { method: "POST", headers: authHeaders() }).finally(() => {
      removeToken();
      navigate("/login");
    });
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`/api/submissions/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("Erro ao eliminar preenchimento");
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      setConfirmDelete(null);
      showToast("Preenchimento eliminado com sucesso!");
    } catch (err) {
      showToast(err.message, true);
    }
  }

  function getFiltered() {
    if (activeTab === "submitted") return submissions.filter((s) => !s.data?.isDraft);
    if (activeTab === "drafts") return submissions.filter((s) => s.data?.isDraft);
    return submissions;
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const filtered = getFiltered();

  return (
    <div className="mysub-container">

      {/* Sidebar */}
      <aside className="mysub-sidebar">
        <div className="mysub-brand">
          <div className="mysub-brand-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <span>FormDocs</span>
        </div>

        <nav className="mysub-nav">
          <button className="mysub-nav-item" onClick={() => navigate("/inicio")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            Dashboard
          </button>
          <button className="mysub-nav-item active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="16" y2="17" />
            </svg>
            Os meus preenchimentos
          </button>
        </nav>

        <div className="mysub-sidebar-bottom">
          <button className="mysub-nav-item" onClick={handleLogout}>
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
      <div className="mysub-main">

        {/* Topbar */}
        <header className="mysub-topbar">
          <span className="mysub-topbar-title">Os meus preenchimentos</span>
          <div className="mysub-topbar-user">
            <div className="mysub-avatar">{user?.email?.[0]?.toUpperCase() || "U"}</div>
            <div className="mysub-user-info">
              <span className="mysub-user-name">{user?.email || "Utilizador"}</span>
              <span className="mysub-user-role">Utilizador</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="mysub-content">
          <div className="mysub-header">
            <h1>Os meus preenchimentos</h1>
            <p>Consulta os formulários que submeteste ou tens em rascunho.</p>
          </div>

          {/* Tabs */}
          <div className="mysub-tabs">
            <button
              className={`mysub-tab ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              Todos
              <span className="mysub-tab-count">{submissions.length}</span>
            </button>
            <button
              className={`mysub-tab ${activeTab === "submitted" ? "active" : ""}`}
              onClick={() => setActiveTab("submitted")}
            >
              Submetidos
              <span className="mysub-tab-count">{submissions.filter(s => !s.data?.isDraft).length}</span>
            </button>
            <button
              className={`mysub-tab ${activeTab === "drafts" ? "active" : ""}`}
              onClick={() => setActiveTab("drafts")}
            >
              Rascunhos
              <span className="mysub-tab-count">{submissions.filter(s => s.data?.isDraft).length}</span>
            </button>
          </div>

          {/* List */}
          {loading ? (
            <p className="mysub-empty">A carregar preenchimentos...</p>
          ) : filtered.length === 0 ? (
            <div className="mysub-empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="16" y2="17" />
              </svg>
              <p>
                {activeTab === "drafts"
                  ? "Não tens nenhum rascunho guardado."
                  : activeTab === "submitted"
                  ? "Ainda não submeteste nenhum formulário."
                  : "Ainda não preencheste nenhum formulário."}
              </p>
              <button className="mysub-go-btn" onClick={() => navigate("/inicio")}>
                Ver formulários disponíveis
              </button>
            </div>
          ) : (
            <div className="mysub-list">
              {filtered.map((sub) => {
                const isDraft = sub.data?.isDraft;
                return (
                  <div key={sub.id} className="mysub-card">
                    <div className="mysub-card-left">
                      <div className={`mysub-card-icon ${isDraft ? "draft" : "submitted"}`}>
                        {isDraft ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 11 12 14 22 4" />
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                          </svg>
                        )}
                      </div>
                      <div className="mysub-card-info">
                        <h3>{sub.form?.name || "Formulário"}</h3>
                        <p>{formatDate(sub.createdAt)}</p>
                      </div>
                    </div>

                    <div className="mysub-card-right">
                      <span className={`mysub-badge ${isDraft ? "badge-draft" : "badge-submitted"}`}>
                        {isDraft ? "Rascunho" : "Submetido"}
                      </span>

                      {isDraft && (
                        <button
                          className="mysub-action-btn continue"
                          onClick={() => navigate(`/preencher/${sub.form?.id}/continuar/${sub.id}`)}
                        >
                          Continuar
                        </button>
                      )}

                      <button
                        className="mysub-action-btn delete"
                        onClick={() => setConfirmDelete(sub.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="mysub-modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="mysub-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Eliminar preenchimento</h3>
            <p>Tens a certeza que queres eliminar este preenchimento? Esta ação é irreversível.</p>
            <div className="mysub-modal-actions">
              <button className="mysub-modal-cancel" onClick={() => setConfirmDelete(null)}>
                Cancelar
              </button>
              <button className="mysub-modal-confirm" onClick={() => handleDelete(confirmDelete)}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <div className={`mysub-toast ${toast.show ? "show" : ""} ${toast.isError ? "toast-error" : ""}`}>
        <span>{toast.message}</span>
      </div>

    </div>
  );
}
