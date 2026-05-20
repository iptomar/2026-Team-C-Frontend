import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { getToken } from "../utils/session";
import "../css/ViewFormPage.css";

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

export default function ViewFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const iframeRef = useRef(null);

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    fetchForm();
  }, [id]);

  // Sempre que o form muda, pede o preview ao servidor
  useEffect(() => {
    if (!form) return;

    fetch("/api/forms/preview", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ html: form.html, css: form.css }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao carregar preview");
        return res.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
      })
      .catch((err) => console.error("Erro no preview:", err));
  }, [form]);

  async function fetchForm() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/forms/${id}`, { headers: authHeaders() });
      if (!res.ok) throw new Error("Formulário não encontrado");
      const data = await res.json();
      setForm(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleStatus() {
    const endpoint = form.archived
      ? `/api/forms/${id}/unarchive`
      : `/api/forms/${id}/archive`;
    try {
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("Erro ao atualizar estado do formulário");
      const updated = await res.json();
      setForm(updated);
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) {
    return (
      <div className="viewform-not-found">
        <p>A carregar formulário...</p>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="viewform-not-found">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        <p>{error || "Formulário não encontrado."}</p>
        <button className="viewform-back-btn" onClick={() => navigate("/meus-formularios")}>
          Voltar aos formulários
        </button>
      </div>
    );
  }

  const fieldCount = getFieldCount(form);

  return (
    <div className="viewform-page">

      {/* Topbar */}
      <header className="viewform-topbar">
        <div className="viewform-topbar-left">
          <button className="viewform-back-btn" onClick={() => navigate("/meus-formularios")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Voltar
          </button>
          <span style={{ color: "#e5e7eb" }}>|</span>
          <h1 className="viewform-topbar-title">{form.name}</h1>
        </div>

        <div className="viewform-topbar-right">
          <span className={`form-status-badge status-${form.archived ? "arquivado" : "ativo"}`}>
            {form.archived ? "Arquivado" : "Ativo"}
          </span>
          <span className="viewform-topbar-meta">
            {fieldCount} campo{fieldCount !== 1 ? "s" : ""} ·
            Criado em {new Date(form.createdAt).toLocaleDateString("pt-PT")}
          </span>
          <button
            className={`archive-btn${form.archived ? " activate-btn" : ""}`}
            onClick={handleToggleStatus}
          >
            {form.archived ? "Ativar" : "Arquivar"}
          </button>
        </div>
      </header>

      {/* Preview via iframe */}
      <main className="viewform-content" style={{ padding: 0 }}>
        {previewUrl ? (
          <iframe
            ref={iframeRef}
            src={previewUrl}
            title="preview"
            className="preview-iframe"
            style={{ width: "100%", height: "100%", border: "none", flex: 1 }}
          />
        ) : (
          <div className="viewform-not-found">
            <p>A gerar preview...</p>
          </div>
        )}
      </main>

    </div>
  );
}
