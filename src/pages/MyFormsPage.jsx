import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/MyFormsPage.css";

export default function MyFormsPage() {
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedForms = JSON.parse(localStorage.getItem("myForms")) || [];
    setForms(savedForms);
  }, []);

  function handleDeleteForm(formId) {
    if (!window.confirm("Tens a certeza que queres eliminar este formulário?")) return;
    const updated = forms.filter((f) => f.id !== formId);
    setForms(updated);
    localStorage.setItem("myForms", JSON.stringify(updated));
  }

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
                {forms.length === 0 ? "Sem formulários" : `${forms.length} formulário${forms.length !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>

          {forms.length === 0 ? (
            <div className="myforms-empty-box">
              <svg className="myforms-empty-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
              <p className="myforms-empty">Ainda não tens formulários guardados.</p>
              <button className="new-form-btn" onClick={() => navigate("/criar-formulario")}>
                Criar primeiro formulário
              </button>
            </div>
          ) : (
            <div className="myforms-list">
              {forms.map((form) => (
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
                      <h3 className="form-card-title">{form.title}</h3>
                      <div className="form-card-meta">
                        <p>{form.fields.length} campo{form.fields.length !== 1 ? "s" : ""}</p>
                        <p>Criado em {new Date(form.createdAt).toLocaleDateString("pt-PT")}</p>
                      </div>
                    </div>
                  </div>

                  <div className="form-card-actions">
                    <button className="view-btn" onClick={() => navigate(`/formulario/${form.id}`)}>Ver</button>
                    <button className="edit-btn" onClick={() => navigate(`/criar-formulario/${form.id}`)}>Editar</button>
                    <button className="delete-btn" onClick={() => handleDeleteForm(form.id)}>Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

    </div>
  );
}