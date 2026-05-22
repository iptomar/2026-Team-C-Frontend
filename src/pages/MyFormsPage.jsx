import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../utils/session";
import "../css/MyFormsPage.css";

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

function getFieldCount(form) {
  try {
    const estrutura = JSON.parse(form.css);
    return (estrutura.fields || []).length;
  } catch {
    return 0;
  }
}

export default function MyFormsPage() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("ativos");
  const [toast, setToast] = useState({ show: false, message: "", isError: false });
  const navigate = useNavigate();

  useEffect(() => {
    fetchForms();
  }, []);

  function showToast(message, isError = false) {
    setToast({ show: true, message, isError });
    setTimeout(() => setToast({ show: false, message: "", isError: false }), 3000);
  }

  async function fetchForms() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/forms", { headers: authHeaders() });
      if (!res.ok) throw new Error("Erro ao carregar formulários");
      const data = await res.json();
      setForms(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteForm(formId) {
    if (!window.confirm("Tens a certeza que queres eliminar este formulário?")) return;
    try {
      const res = await fetch(`/api/forms/${formId}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("Erro ao eliminar formulário");
      setForms((prev) => prev.filter((f) => f.id !== formId));
      showToast("Formulário eliminado com sucesso.");
    } catch (err) {
      showToast(err.message, true);
    }
  }

  async function handleToggleStatus(form) {
    const endpoint = form.archived
      ? `/api/forms/${form.id}/unarchive`
      : `/api/forms/${form.id}/archive`;
    try {
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("Erro ao atualizar estado do formulário");
      const updated = await res.json();
      setForms((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
      showToast(
        form.archived
          ? `Formulário "${form.name}" ativado com sucesso.`
          : `Formulário "${form.name}" arquivado com sucesso.`
      );
    } catch (err) {
      showToast("Não foi possível alterar o estado do formulário.", true);
    }
  }

  const filteredForms = forms.filter((form) => {
    if (activeTab === "todos") return true;
    return activeTab === "arquivados" ? form.archived : !form.archived;
  });

  return (
    <div className="myforms-page">

      {/* Topbar */}
      <header className="myforms-topbar">
        <div className="myforms-topbar-left">
          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Voltar
          </button>
          <span style={{ color: "#e5e7eb" }}>|</span>
          <h1 className="myforms-topbar-title">Os meus formulários</h1>
        </div>

        <button className="new-form-btn" onClick={() => navigate("/criar-formulario")}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Criar formulário
        </button>
      </header>

      {/* Content */}
      <main className="myforms-content">
        <div className="myforms-container">

          <div className="myforms-header">
            <div>
              <h2 className="myforms-title">Os meus formulários</h2>
              <p className="myforms-count">
                {loading
                  ? "A carregar..."
                  : filteredForms.length === 0
                    ? "Sem formulários"
                    : `${filteredForms.length} formulário${filteredForms.length !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="myforms-tabs">
            <button
              className={`tab-btn ${activeTab === "ativos" ? "active" : ""}`}
              onClick={() => setActiveTab("ativos")}
            >
              Ativos ({forms.filter((f) => !f.archived).length})
            </button>
            <button
              className={`tab-btn ${activeTab === "arquivados" ? "active" : ""}`}
              onClick={() => setActiveTab("arquivados")}
            >
              Arquivados ({forms.filter((f) => f.archived).length})
            </button>
            <button
              className={`tab-btn ${activeTab === "todos" ? "active" : ""}`}
              onClick={() => setActiveTab("todos")}
            >
              Todos ({forms.length})
            </button>
          </div>

          {loading ? (
            <div className="myforms-empty-box">
              <p className="myforms-empty">A carregar formulários...</p>
            </div>
          ) : error ? (
            <div className="myforms-empty-box">
              <p className="myforms-empty">{error}</p>
              <button className="new-form-btn" onClick={fetchForms}>
                Tentar novamente
              </button>
            </div>
          ) : filteredForms.length === 0 ? (
            <div className="myforms-empty-box">
              <svg className="myforms-empty-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
              <p className="myforms-empty">
                {activeTab === "arquivados"
                  ? "Não tens formulários arquivados."
                  : "Ainda não tens formulários guardados."}
              </p>
              {activeTab === "ativos" && (
                <button className="new-form-btn" onClick={() => navigate("/criar-formulario")}>
                  Criar primeiro formulário
                </button>
              )}
            </div>
          ) : (
            <div className="myforms-list">
              {filteredForms.map((form) => (
                <div key={form.id} className="form-card">
                  <div className="form-card-left">
                    <div className="form-card-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="8" y1="13" x2="16" y2="13" />
                        <line x1="8" y1="17" x2="16" y2="17" />
                      </svg>
                    </div>
                    <div className="form-card-info">
                      <h3 className="form-card-title">{form.name}</h3>
                      <div className="form-card-meta">
                        <p>{getFieldCount(form)} campo{getFieldCount(form) !== 1 ? "s" : ""}</p>
                        <p>Criado em {new Date(form.createdAt).toLocaleDateString("pt-PT")}</p>
                        <span className={`form-status-badge status-${form.archived ? "arquivado" : "ativo"}`}>
                          {form.archived ? "Arquivado" : "Ativo"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="form-card-actions">
                    <button className="view-btn" onClick={() => navigate(`/formulario/${form.id}`)}>Ver</button>
                    <button className="edit-btn" onClick={() => navigate(`/criar-formulario/${form.id}`)}>Editar</button>
                    <button
                      className={`archive-btn${form.archived ? " activate-btn" : ""}`}
                      onClick={() => handleToggleStatus(form)}
                    >
                      {form.archived ? "Ativar" : "Arquivar"}
                    </button>
                    <button className="delete-btn" onClick={() => handleDeleteForm(form.id)}>Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      {/* Toast */}
      <div className={`myforms-toast ${toast.show ? "show" : ""} ${toast.isError ? "toast-error" : ""}`}>
        <span>{toast.message}</span>
      </div>

    </div>
  );
}
