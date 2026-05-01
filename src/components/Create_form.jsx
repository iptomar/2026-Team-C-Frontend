import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DndContext } from "@dnd-kit/core";

import FormCanvas from "./FormCanvas";
import FieldPalette from "./FieldPalette";
import FieldEditor from "./FieldEditor";
import "../css/create_forms.css";
import FormRenderer from "./FormRenderer";
import "../css/ViewFormPage.css";
import { useParams } from "react-router-dom";

// ── Gerador de HTML para pré-visualização ────────────────────────
function generatePreviewHTML(title, rows, fields) {
  function renderField(field) {
    switch (field.type) {
      case "text":
        return `<div class="viewform-field"><label>${field.label}</label><input type="text" placeholder="${field.placeholder ?? ""}" disabled /></div>`;
      case "textarea":
        return `<div class="viewform-field"><label>${field.label}</label><textarea placeholder="${field.placeholder ?? ""}" disabled></textarea></div>`;
      case "number":
        return `<div class="viewform-field"><label>${field.label}</label><input type="number" disabled /></div>`;
      case "email":
        return `<div class="viewform-field"><label>${field.label}</label><input type="email" placeholder="exemplo@email.com" disabled /></div>`;
      case "date":
        return `<div class="viewform-field"><label>${field.label}</label><input type="date" disabled /></div>`;
      case "select":
        return `<div class="viewform-field"><label>${field.label}</label><select disabled><option value="">Seleciona uma opção</option>${(field.options ?? []).map(o => `<option>${o}</option>`).join("")}</select></div>`;
      case "radio":
        return `<div class="viewform-field"><label>${field.label}</label><div class="viewform-radio-group">${(field.options ?? []).map(o => `<label class="viewform-radio-option"><input type="radio" name="${field.id}" disabled />${o}</label>`).join("")}</div></div>`;
      case "checkbox":
        return `<div class="viewform-field"><label>${field.label}</label><div class="viewform-checkbox-group">${(field.options ?? []).map(o => `<label class="viewform-checkbox-option"><input type="checkbox" disabled />${o}</label>`).join("")}${field.hasOther ? `<label class="viewform-checkbox-option"><input type="checkbox" disabled />${field.otherLabel ?? "Outros"}<input type="text" placeholder="Especifica..." class="viewform-other-input" disabled /></label>` : ""}</div></div>`;
      case "file":
        return `<div class="viewform-field"><label>${field.label}</label><input type="file" disabled /></div>`;
      case "rating":
        return `<div class="viewform-field"><label>${field.label}</label><div class="viewform-stars">${Array.from({ length: field.stars ?? 5 }).map((_, i) => `<span class="viewform-star" data-index="${i}">★</span>`).join("")}</div></div>`;
      case "title":
        return `<div class="viewform-field" style="border-top:none;padding-top:0"><h2 style="margin:0;font-size:18px;font-weight:700;color:#111827">${field.label}</h2></div>`;
      default:
        return "";
    }
  }

  const rowsHTML = rows.map(row => {
    const cols = Array.from({ length: row.colCount }, (_, colIndex) => {
      const field = fields.find(f => f.rowId === row.id && f.colIndex === colIndex);
      return `<div>${field ? renderField(field) : ""}</div>`;
    }).join("");
    return `<div style="display:grid;grid-template-columns:repeat(${row.colCount},1fr);gap:12px;">${cols}</div>`;
  }).join("");

  return `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pré-visualização</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { margin: 0; font-family: Inter, system-ui, sans-serif; background: #f8f9fb; color: #111827; user-select: none; }

    .viewform-content { display: flex; justify-content: center; padding: 32px 20px; }
    .viewform-container { width: 100%; max-width: 600px; display: flex; flex-direction: column; gap: 12px; }

    .viewform-intro { background: #ffffff; border: 1px solid #e5e7eb; border-top: 4px solid #DD6418; border-radius: 14px; padding: 20px 24px; }
    .viewform-intro h1 { font-size: 20px; font-weight: 700; color: #111827; letter-spacing: -0.4px; margin: 0 0 4px 0; }
    .viewform-intro p { font-size: 13px; color: #9ca3af; margin: 0; }

    .viewform-card { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 24px; display: flex; flex-direction: column; gap: 20px; }

    .viewform-field { display: flex; flex-direction: column; gap: 6px; }
    .viewform-field label { font-size: 13px; font-weight: 600; color: #374151; }
    .viewform-field input,
    .viewform-field textarea,
    .viewform-field select {
      padding: 9px 12px; border-radius: 8px; border: 1.5px solid #e5e7eb;
      font-size: 14px; color: #6b7280; background: #f9fafb; outline: none;
      font-family: inherit; width: 100%; cursor: not-allowed;
    }
    .viewform-field textarea { min-height: 90px; resize: none; }
    .viewform-field input[type="checkbox"],
    .viewform-field input[type="radio"] { width: auto; padding: 0; border: none; background: transparent; cursor: not-allowed; }
    .viewform-field + .viewform-field { padding-top: 20px; border-top: 1px solid #f3f4f6; }

    .viewform-radio-group, .viewform-checkbox-group { display: flex; flex-direction: column; gap: 8px; }
    .viewform-radio-option, .viewform-checkbox-option { display: flex; align-items: center; gap: 10px; font-size: 14px; color: #374151; cursor: not-allowed; }
    .viewform-other-input { border: none; border-bottom: 1px solid #d1d5db; outline: none; font-size: 14px; padding: 2px 4px; background: transparent; color: #374151; width: 120px; margin-left: 4px; cursor: not-allowed; }

    .viewform-stars { display: flex; gap: 4px; margin-top: 2px; pointer-events: none; }
    .viewform-star { font-size: 24px; color: #e5e7eb; line-height: 1; }
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
</html>`;
}

export default function Create_form() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [rows, setRows] = useState([
    { id: crypto.randomUUID(), colCount: 1, colWidths: [100], height: null },
  ]);
  const [fields, setFields] = useState([]);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const selectedField = fields.find((f) => f.id === selectedFieldId);

  // Actualiza o iframe sempre que o painel está aberto e o conteúdo muda
  useEffect(() => {
    if (!showPreview || !iframeRef.current) return;
    const html = generatePreviewHTML(formTitle, rows, fields);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    iframeRef.current.src = url;
    return () => URL.revokeObjectURL(url);
  }, [showPreview, formTitle, rows, fields]);

  function equalWidths(n) {
    return Array.from({ length: n }, () => 100 / n);
  }

  function addRow() {
    setRows((prev) => [
      ...prev,
      { id: crypto.randomUUID(), colCount: 1, colWidths: [100], height: null },
    ]);
  }

  function removeRow(rowId) {
    setRows((prev) => prev.filter((r) => r.id !== rowId));
    setFields((prev) => prev.filter((f) => f.rowId !== rowId));
    setSelectedFieldId((prev) => {
      const fieldInRow = fields.find((f) => f.rowId === rowId && f.id === prev);
      return fieldInRow ? null : prev;
    });
  }

  function setRowCols(rowId, colCount) {
    setFields((prev) =>
      prev.filter((f) => !(f.rowId === rowId && f.colIndex >= colCount)),
    );
    setRows((prev) =>
      prev.map((r) =>
        r.id === rowId
          ? { ...r, colCount, colWidths: equalWidths(colCount) }
          : r,
      ),
    );
  }

  function setRowColWidths(rowId, colWidths) {
    setRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, colWidths } : r)),
    );
  }

  function setRowHeight(rowId, height) {
    setRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, height } : r)));
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    const overId = String(over.id);
    if (!overId.startsWith("cell::")) return;

    const [, rowId, colStr] = overId.split("::");
    const colIndex = parseInt(colStr, 10);

    const targetOccupied = fields.find(
      (f) => f.rowId === rowId && f.colIndex === colIndex,
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
          placeholder: "Escreve aqui...",
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
        prev.map((f) => (f.id === fieldId ? { ...f, rowId, colIndex } : f)),
      );
    }
  }

  function updateField(id, newData) {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...newData } : f)),
    );
  }

  function deleteField(id) {
    setFields((prev) => prev.filter((f) => f.id !== id));
    setSelectedFieldId(null);
  }

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Delete" && selectedFieldId) deleteField(selectedFieldId);
      if (e.key === "Escape" && showPreview) setShowPreview(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedFieldId]);

  // ── ID ────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;

    const savedForms = JSON.parse(localStorage.getItem("myForms")) || [];

    const existingForm = savedForms.find((f) => f.id === id);

    if (!existingForm) return;

    setFormTitle(existingForm.title || "");
    setRows(existingForm.rows || []);
    setFields(existingForm.fields || []);
  }, [id]);

  // ── Guardar formulário ──────────────────────────────────────────
  function handleSaveForm() {
    const trimmedTitle = formTitle.trim();

    if (!trimmedTitle) {
      alert("Escreve um título para o formulário.");
      return;
    }

  function handlePreview() {
    if (fields.length === 0) {
      alert("Adiciona pelo menos um campo para pré-visualizar.");
      return;
    }
    setShowPreview(true);
  }

  function handleSaveForm() {
    const trimmedTitle = formTitle.trim();
    if (!trimmedTitle) { alert("Escreve um título para o formulário."); return; }
    if (fields.length === 0) { alert("Adiciona pelo menos um campo antes de guardar."); return; }

    const existingForms = JSON.parse(localStorage.getItem("myForms")) || [];

    const formData = {
      id: id || crypto.randomUUID(),
      title: trimmedTitle,
      createdAt: new Date().toISOString(),
      rows,
      fields,
    };

    let updatedForms;

    // EDITAR
    if (id) {
      updatedForms = existingForms.map((f) => (f.id === id ? formData : f));
    }
    // NOVO
    else {
      updatedForms = [...existingForms, formData];
    }

    localStorage.setItem("myForms", JSON.stringify(updatedForms));

    alert(id ? "Formulário atualizado!" : "Formulário guardado!");

    navigate("/meus-formularios");
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="create-form-page">
        {/* Header */}
        <div className="form-header">
          <input
            type="text"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            className="form-title-input"
            placeholder="Escreve o título do formulário"
          />
          <div className="header-buttons">
            <div
              className={`view-switch ${previewMode ? "preview-active" : ""}`}
            >
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
            <button
              className={`preview-btn ${showPreview ? "preview-btn--active" : ""}`}
              onClick={() => showPreview ? setShowPreview(false) : handlePreview()}
            >
              {showPreview ? "Fechar pré-visualização" : "Pré-visualizar"}
            </button>
            <button className="save-btn" onClick={handleSaveForm}>
              Guardar formulário
            </button>
          </div>
        </div>

        {/* Builder */}
        {previewMode ? (
          <div className="viewform-page">
            <main className="viewform-content">
              <div className="viewform-container">
                <div className="viewform-intro">
                  <h1>{formTitle || "Formulário sem título"}</h1>
                  <p>Preencha todos os campos e submeta o formulário.</p>
                </div>

                <div className="viewform-card">
                  <FormRenderer rows={rows} fields={fields} />
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
            <FormCanvas
              rows={rows}
              fields={fields}
              onAddRow={addRow}
              onRemoveRow={removeRow}
              onSetCols={setRowCols}
              onSetColWidths={setRowColWidths}
              onSetHeight={setRowHeight}
              setSelectedField={setSelectedFieldId}
              selectedFieldId={selectedFieldId}
              onDeleteField={deleteField}
            />

            <FieldPalette />

            <FieldEditor
              field={selectedField}
              updateField={updateField}
              deleteField={deleteField}
            />
          </div>
        )}
      </div>
    </DndContext>
  );
}