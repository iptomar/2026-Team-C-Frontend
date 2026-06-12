import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DndContext } from "@dnd-kit/core";

import FormCanvas from "./FormCanvas";
import FieldPalette from "./FieldPalette";
import FieldEditor from "./FieldEditor";
import FormRenderer from "./FormRenderer";
import FormSection from "./FormSection";

import { getToken } from "../utils/session";

import "../css/create_forms.css";
import "../css/ViewFormPage.css";

function getOwnerId() {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.userId;
  } catch {
    return null;
  }
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

function generatePreviewHTML(title, rows, fields) {
  function renderField(field) {
    switch (field.type) {
      case "text":
        return `
          <div class="viewform-field">
            <label>${field.label}</label>
            <input type="text" placeholder="${field.placeholder ?? ""}" disabled />
          </div>
        `;

      case "textarea":
        return `
          <div class="viewform-field">
            <label>${field.label}</label>
            <textarea placeholder="${field.placeholder ?? ""}" disabled></textarea>
          </div>
        `;

      case "number":
        return `
          <div class="viewform-field">
            <label>${field.label}</label>
            <input type="number" disabled />
          </div>
        `;

      case "email":
        return `
          <div class="viewform-field">
            <label>${field.label}</label>
            <input type="email" placeholder="exemplo@email.com" disabled />
          </div>
        `;

      case "date":
        return `
          <div class="viewform-field">
            <label>${field.label}</label>
            <input type="date" disabled />
          </div>
        `;

      case "select":
        return `
          <div class="viewform-field">
            <label>${field.label}</label>
            <select disabled>
              <option>Seleciona uma opção</option>
              ${(field.options || []).map((o) => `<option>${o}</option>`).join("")}
            </select>
          </div>
        `;

      case "radio":
        return `
          <div class="viewform-field">
            <label>${field.label}</label>
            <div class="viewform-radio-group">
              ${(field.options || [])
                .map(
                  (o) => `
                    <label class="viewform-radio-option">
                      <input type="radio" disabled />
                      ${o}
                    </label>
                  `
                )
                .join("")}
            </div>
          </div>
        `;

      case "checkbox":
        return `
          <div class="viewform-field">
            <label>${field.label}</label>
            <div class="viewform-checkbox-group">
              ${(field.options || [])
                .map(
                  (o) => `
                    <label class="viewform-checkbox-option">
                      <input type="checkbox" disabled />
                      ${o}
                    </label>
                  `
                )
                .join("")}
              ${
                field.hasOther
                  ? `
                    <label class="viewform-checkbox-option">
                      <input type="checkbox" disabled />
                      ${field.otherLabel || "Outros"}
                      <input
                        type="text"
                        class="viewform-other-input"
                        placeholder="Especifica..."
                        disabled
                      />
                    </label>
                  `
                  : ""
              }
            </div>
          </div>
        `;

      case "file":
        return `
          <div class="viewform-field">
            <label>${field.label}</label>
            <input type="file" disabled />
          </div>
        `;

      case "rating":
        return `
          <div class="viewform-field">
            <label>${field.label}</label>
            <div class="viewform-stars">
              ${Array.from({ length: field.stars || 5 })
                .map(() => `<span class="viewform-star">★</span>`)
                .join("")}
            </div>
          </div>
        `;

      case "title":
        return `
          <div class="viewform-field viewform-field-title">
            <h2>${field.label}</h2>
          </div>
        `;

      case "subtitle":
        return `
          <div class="viewform-field viewform-field-subtitle">
            <h3>${field.label}</h3>
          </div>
        `;

      case "info":
        return `
          <div class="viewform-field viewform-field-info">
            <p>${field.label || "Escreva aqui o seu texto explicativo..."}</p>
          </div>
        `;

      default:
        return "";
    }
  }

  const rowsHTML = rows
    .map((row) => {
      const cols = Array.from({ length: row.colCount }, (_, colIndex) => {
        const field = fields.find(
          (f) => f.rowId === row.id && f.colIndex === colIndex
        );

        return `<div>${field ? renderField(field) : ""}</div>`;
      }).join("");

      return `
        <div style="display:grid;grid-template-columns:repeat(${row.colCount},1fr);gap:12px;">
          ${cols}
        </div>
      `;
    })
    .join("");

  return `
<!DOCTYPE html>
<html lang="pt">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<style>
*{ box-sizing:border-box; }
body{ margin:0; background:#f8f9fb; font-family:Inter,system-ui,sans-serif; }
.viewform-content{ display:flex; justify-content:center; padding:32px 20px; }
.viewform-container{ width:100%; max-width:700px; display:flex; flex-direction:column; gap:14px; }
.viewform-intro{ background:#fff; border:1px solid #e5e7eb; border-top:4px solid #DD6418; border-radius:14px; padding:24px; }
.viewform-intro h1{ margin:0 0 4px; font-size:22px; color:#111827; }
.viewform-intro p{ margin:0; color:#9ca3af; font-size:13px; }
.viewform-card{ background:#fff; border:1px solid #e5e7eb; border-radius:14px; padding:24px; display:flex; flex-direction:column; gap:20px; }
.viewform-field{ display:flex; flex-direction:column; gap:6px; }
.viewform-field label{ font-size:13px; font-weight:600; color:#374151; }
.viewform-field input, .viewform-field textarea, .viewform-field select{ width:100%; padding:10px 14px; border-radius:10px; border:1.5px solid #e5e7eb; background:#f9fafb; font-size:14px; }
.viewform-field textarea{ min-height:90px; }
.viewform-radio-group, .viewform-checkbox-group{ display:flex; flex-direction:column; gap:8px; }
.viewform-radio-option, .viewform-checkbox-option{ display:flex; align-items:center; gap:10px; font-size:14px; }
.viewform-stars{ display:flex; gap:4px; }
.viewform-star{ color:#DD6418; font-size:24px; }
.viewform-other-input{ border:none; border-bottom:1px solid #d1d5db; background:transparent; width:120px; }
.viewform-field-title{ margin-top:32px; padding-top:16px; border-top:2px solid #e5e7eb; }
.viewform-card > div:first-child .viewform-field-title{ margin-top:0; padding-top:0; border-top:none; }
.viewform-field-info p{ margin:0; font-size:14px; color:#4b5563; line-height:1.5; white-space:pre-wrap; }
</style>
</head>
<body>
<div class="viewform-content">
  <div class="viewform-container">
    <div class="viewform-intro">
      <h1>${title || "Formulário sem título"}</h1>
      <p>Preencha todos os campos e submeta o formulário.</p>
    </div>
    <div class="viewform-card">
      ${rowsHTML}
    </div>
  </div>
</div>
</body>
</html>
`;
}

export default function Create_form() {
  const navigate = useNavigate();
  const { id } = useParams();
  const iframeRef = useRef(null);

  const [rows, setRows] = useState([
    {
      id: crypto.randomUUID(),
      colCount: 1,
      colWidths: [100],
      height: null,
    },
  ]);

  const [fields, setFields] = useState([]);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formTitle, setFormTitle] = useState("");

  const [sectionTitles, setSectionTitles] = useState({
    identification: "Identificação",
    subject: "Assunto | Descrição",
    foundation: "Fundamentação",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const selectedField = fields.find((f) => f.id === selectedFieldId);

  useEffect(() => {
    if (!showPreview || !iframeRef.current) return;

    const html = generatePreviewHTML(formTitle, rows, fields);

    fetch("/api/forms/preview", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ html, css: "" }),
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        iframeRef.current.src = url;
      })
      .catch((err) => console.error("Erro no preview:", err));
  }, [showPreview, formTitle, rows, fields]);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/forms/${id}`, {
      headers: authHeaders(),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Formulário não encontrado");
        return res.json();
      })
      .then((form) => {
        setFormTitle(form.name || "");

        try {
          const estrutura = JSON.parse(form.css);

          setRows(estrutura.rows || []);
          setFields(estrutura.fields || []);

          if (estrutura.sectionTitles) {
            setSectionTitles(estrutura.sectionTitles);
          }
        } catch {
          console.error("Não foi possível reconstruir a estrutura do formulário.");
        }
      })
      .catch((err) => console.error("Erro ao carregar formulário:", err));
  }, [id]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Delete" && selectedFieldId) {
        deleteField(selectedFieldId);
      }

      if (e.key === "Escape") {
        setShowPreview(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedFieldId]);

  function equalWidths(n) {
    return Array.from({ length: n }, () => 100 / n);
  }

function addRow(section = "foundation") {
  setRows((prev) => [
    ...prev,
    {
      id: crypto.randomUUID(),
      colCount: 1,
      colWidths: [100],
      height: null,
      section,
    },
  ]);
}

  function removeRow(rowId) {
    setRows((prev) => prev.filter((r) => r.id !== rowId));
    setFields((prev) => prev.filter((f) => f.rowId !== rowId));
  }

  function setRowCols(rowId, colCount) {
    setFields((prev) =>
      prev.filter((f) => !(f.rowId === rowId && f.colIndex >= colCount))
    );

    setRows((prev) =>
      prev.map((r) =>
        r.id === rowId
          ? { ...r, colCount, colWidths: equalWidths(colCount) }
          : r
      )
    );
  }

  function setRowColWidths(rowId, colWidths) {
    setRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, colWidths } : r))
    );
  }

  function setRowHeight(rowId, height) {
    setRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, height } : r))
    );
  }

  function updateField(id, newData) {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...newData } : f))
    );
  }

  function deleteField(id) {
    setFields((prev) => prev.filter((f) => f.id !== id));
    setSelectedFieldId(null);
  }

  function addFieldToCell(type, rowId, colIndex) {
    const targetOccupied = fields.find(
      (f) => f.rowId === rowId && f.colIndex === colIndex
    );

    if (targetOccupied) return;

    setFields((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type,
        rowId,
        colIndex,
        label: "Descrição",
        placeholder: "Escreva aqui...",
        options: ["Opção 1", "Opção 2"],
        stars: 5,
        hasOther: false,
        otherLabel: "Outros",
      },
    ]);
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over) return;

    const overId = String(over.id);

    if (!overId.startsWith("cell::")) return;

    const [, rowId, colStr] = overId.split("::");
    const colIndex = parseInt(colStr, 10);

    const targetOccupied = fields.find(
      (f) => f.rowId === rowId && f.colIndex === colIndex
    );

    if (active.data.current?.from === "palette") {
      if (targetOccupied) return;

      setFields((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          type: active.data.current.type,
          rowId,
          colIndex,
          label: "Descrição",
          placeholder: "Escreva aqui...",
          options: ["Opção 1", "Opção 2"],
          stars: 5,
          hasOther: false,
          otherLabel: "Outros",
        },
      ]);

      return;
    }

    if (active.data.current?.from === "cell") {
      const fieldId = active.id;

      if (targetOccupied && targetOccupied.id !== fieldId) return;

      setFields((prev) =>
        prev.map((f) =>
          f.id === fieldId ? { ...f, rowId, colIndex } : f
        )
      );
    }
  }

  function handlePreview() {
    if (fields.length === 0) {
      setErrorMessage("Adicione pelo menos um campo para pré-visualizar.");
      return;
    }

    setShowPreview(true);
  }

  async function handleSaveForm() {
    setSuccessMessage("");
    setErrorMessage("");

    const trimmedTitle = formTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage("Por favor insira um título para o formulário.");
      return;
    }

    if (fields.length === 0) {
      setErrorMessage("Adicione pelo menos um campo antes de guardar.");
      return;
    }

    const ownerId = getOwnerId();

    if (!ownerId) {
      setErrorMessage("Sessão expirada. Faz login novamente.");
      setTimeout(() => navigate("/login"), 1200);
      return;
    }

    const html = generatePreviewHTML(trimmedTitle, rows, fields);

    const css = JSON.stringify({
      rows,
      fields,
      sectionTitles,
    });

    try {
      let res;

      if (id) {
        res = await fetch(`/api/forms/${id}`, {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify({
            name: trimmedTitle,
            html,
            css,
            fields,
          }),
        });
      } else {
        res = await fetch("/api/forms", {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({
            name: trimmedTitle,
            html,
            css,
            fields,
            ownerId,
          }),
        });
      }

      if (!res.ok) {
        const erro = await res.json();
        setErrorMessage(erro.erro || "Erro ao guardar formulário.");
        return;
      }

      setSuccessMessage(
        id ? "Dados atualizados com sucesso." : "Dados guardados com sucesso."
      );

      setTimeout(() => {
        navigate("/meus-formularios");
      }, 1200);
    } catch (err) {
      console.error("Erro ao guardar formulário:", err);
      setErrorMessage("Erro de ligação ao servidor.");
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="create-form-page">
        <div className="form-header">
          <input
            type="text"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            className="form-title-input"
            placeholder="Por favor escreva o título do formulário"
          />

          <div className="header-buttons">
            <div className={`view-switch ${previewMode ? "preview-active" : ""}`}>
              <button
                className={!previewMode ? "active" : ""}
                onClick={() => setPreviewMode(false)}
              >
                Editar
              </button>

              <button
                className={previewMode ? "active" : ""}
                onClick={() => setPreviewMode(true)}
              >
                Pré-visualizar
              </button>
            </div>

            <button className="back-btn" onClick={() => navigate(-1)}>
              Voltar
            </button>

            <button className="save-btn" onClick={handleSaveForm}>
              Guardar formulário
            </button>
          </div>
        </div>

        {successMessage && (
          <div className="form-success-message">{successMessage}</div>
        )}

        {errorMessage && (
          <div className="form-error-message">{errorMessage}</div>
        )}

        {previewMode ? (
          <div className="viewform-page">
            <main className="viewform-content">
              <div className="viewform-container">
                <div className="viewform-intro">
                  <h1>{formTitle || "Formulário sem título"}</h1>
                  <p>Preencha todos os campos e submeta o formulário.</p>
                </div>

<div className="viewform-card">
  <FormSection
    number="1"
    title={sectionTitles.identification}
  />

  <FormRenderer
    rows={rows.filter(
      (row) => row.section === "identification"
    )}
    fields={fields}
  />

  <FormSection
    number="2"
    title={sectionTitles.subject}
  />

  <FormRenderer
    rows={rows.filter(
      (row) => row.section === "subject"
    )}
    fields={fields}
  />

  <FormSection
    number="3"
    title={sectionTitles.foundation}
  />

  <FormRenderer
    rows={rows.filter(
      (row) =>
        !row.section ||
        row.section === "foundation"
    )}
    fields={fields}
  />
</div>

                <div className="viewform-actions">
                  <button className="viewform-submit">
                    Submeter formulário
                  </button>
                </div>
              </div>
            </main>
          </div>
        ) : (
          <div className="builder">
            <div style={{ flex: 1 }}>
            
<FormCanvas
  rows={rows}
  fields={fields}
  sectionTitles={sectionTitles}
  setSectionTitles={setSectionTitles}
  onAddRow={addRow}
  onRemoveRow={removeRow}
  onSetCols={setRowCols}
  onSetColWidths={setRowColWidths}
  onSetHeight={setRowHeight}
  setSelectedField={setSelectedFieldId}
  selectedFieldId={selectedFieldId}
  onDeleteField={deleteField}
  onAddField={addFieldToCell}
/>
            </div>

            <FieldPalette />

            <FieldEditor
              field={selectedField}
              updateField={updateField}
              deleteField={deleteField}
            />
          </div>
        )}

        {showPreview && (
          <div className="preview-overlay">
            <div className="preview-panel">
              <div className="preview-panel-header">
                <h2>Pré-visualização</h2>

                <button
                  className="preview-close-btn"
                  onClick={() => setShowPreview(false)}
                >
                  Fechar preview
                </button>
              </div>

              <iframe
                ref={iframeRef}
                title="preview"
                className="preview-iframe"
              />
            </div>
          </div>
        )}
      </div>
    </DndContext>
  );
}