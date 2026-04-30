import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../css/ViewFormPage.css";

function StarRating({ count }) {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);

  return (
    <div className="viewform-stars">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={`viewform-star ${i < (hovered || selected) ? "active" : ""}`}
          onMouseEnter={() => setHovered(i + 1)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => setSelected(i + 1)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function FormField({ field }) {
  switch (field.type) {
    case "text":
      return (
        <div className="viewform-field">
          <label>{field.label}</label>
          <input type="text" placeholder={field.placeholder} />
        </div>
      );
    case "textarea":
      return (
        <div className="viewform-field">
          <label>{field.label}</label>
          <textarea placeholder={field.placeholder} />
        </div>
      );
    case "number":
      return (
        <div className="viewform-field">
          <label>{field.label}</label>
          <input type="number" />
        </div>
      );
    case "email":
      return (
        <div className="viewform-field">
          <label>{field.label}</label>
          <input type="email" placeholder="exemplo@email.com" />
        </div>
      );
    case "date":
      return (
        <div className="viewform-field">
          <label>{field.label}</label>
          <input type="date" />
        </div>
      );
    case "select":
      return (
        <div className="viewform-field">
          <label>{field.label}</label>
          <select>
            <option value="">Seleciona uma opção</option>
            {field.options?.map((opt, i) => (
              <option key={i}>{opt}</option>
            ))}
          </select>
        </div>
      );
    case "radio":
      return (
        <div className="viewform-field">
          <label>{field.label}</label>
          <div className="viewform-radio-group">
            {field.options?.map((opt, i) => (
              <label key={i} className="viewform-radio-option">
                <input type="radio" name={field.id} value={opt} />
                {opt}
              </label>
            ))}
          </div>
        </div>
      );
    case "checkbox":
      return (
        <div className="viewform-field">
          <label>{field.label}</label>
          <div className="viewform-checkbox-group">
            {(field.options || []).map((opt, i) => (
              <label key={i} className="viewform-checkbox-option">
                <input type="checkbox" value={opt} />
                {opt}
              </label>
            ))}
            {field.hasOther && (
              <label className="viewform-checkbox-option">
                <input type="checkbox" />
                <span>{field.otherLabel || "Outros"}</span>
                <input
                  type="text"
                  placeholder="Especifica..."
                  className="viewform-other-input"
                />
              </label>
            )}
          </div>
        </div>
      );
    case "file":
      return (
        <div className="viewform-field">
          <label>{field.label}</label>
          <input type="file" />
        </div>
      );
    case "rating":
      return (
        <div className="viewform-field">
          <label>{field.label}</label>
          <StarRating count={field.stars ?? 5} />
        </div>
      );
    case "title":
      return (
        <div className="viewform-field" style={{ borderTop: "none", paddingTop: 0 }}>
          <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#111827" }}>
            {field.label}
          </h2>
        </div>
      );
    default:
      return null;
  }
}

export default function ViewFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    const savedForms = JSON.parse(localStorage.getItem("myForms")) || [];
    const found = savedForms.find((f) => f.id === id);
    setForm(found || null);
  }, [id]);

  if (!form) {
    return (
      <div className="viewform-not-found">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        <p>Formulário não encontrado.</p>
        <button className="viewform-back-btn" onClick={() => navigate("/meus-formularios")}>
          Voltar aos formulários
        </button>
      </div>
    );
  }

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
          <h1 className="viewform-topbar-title">{form.title}</h1>
        </div>
        <span className="viewform-topbar-meta">
          {form.fields.length} campo{form.fields.length !== 1 ? "s" : ""} · Criado em {new Date(form.createdAt).toLocaleDateString("pt-PT")}
        </span>
      </header>

      {/* Content */}
      <main className="viewform-content">
        <div className="viewform-container">

          {/* Intro */}
          <div className="viewform-intro">
            <h1>{form.title}</h1>
            <p>Preencha todos os campos e submeta o formulário.</p>
          </div>

          {/* Campos */}
          <div className="viewform-card">
            {form.rows ? (
              /* Novo formato: rows + columns */
              form.rows.map((row) => (
                <div
                  key={row.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${row.colCount}, 1fr)`,
                    gap: "12px",
                    marginBottom: "8px",
                  }}
                >
                  {Array.from({ length: row.colCount }, (_, colIndex) => {
                    const field = form.fields.find(
                      (f) => f.rowId === row.id && f.colIndex === colIndex
                    );
                    return (
                      <div key={colIndex}>
                        {field ? <FormField field={field} /> : null}
                      </div>
                    );
                  })}
                </div>
              ))
            ) : (
              /* Formato antigo: lista plana */
              form.fields.map((field) => (
                <FormField key={field.id} field={field} />
              ))
            )}
          </div>

          {/* Ações */}
          <div className="viewform-actions">
            <button className="viewform-submit">Submeter formulário</button>
          </div>

        </div>
      </main>

    </div>
  );
}