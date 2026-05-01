import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DndContext } from "@dnd-kit/core";

import FormCanvas from "./FormCanvas";
import FieldPalette from "./FieldPalette";
import FieldEditor from "./FieldEditor";
import "../css/create_forms.css";
import FormRenderer from "./FormRenderer";
import "../css/ViewFormPage.css";
import { useParams } from "react-router-dom";

export default function Create_form() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Lista de linhas: cada linha tem id, nº colunas, larguras e altura
  const [rows, setRows] = useState([
    { id: crypto.randomUUID(), colCount: 1, colWidths: [100], height: null },
  ]);

  // Campos colocados nas células (rowId + colIndex em vez de x,y)
  const [fields, setFields] = useState([]);

  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [formTitle, setFormTitle] = useState("");

  const selectedField = fields.find((f) => f.id === selectedFieldId);

  // ── Larguras iguais para N colunas ──────────────────────────────
  function equalWidths(n) {
    return Array.from({ length: n }, () => 100 / n);
  }

  // ── Adicionar linha ──────────────────────────────────────────────
  function addRow() {
    setRows((prev) => [
      ...prev,
      { id: crypto.randomUUID(), colCount: 1, colWidths: [100], height: null },
    ]);
  }

  // ── Remover linha (e os seus campos) ────────────────────────────
  function removeRow(rowId) {
    setRows((prev) => prev.filter((r) => r.id !== rowId));
    setFields((prev) => prev.filter((f) => f.rowId !== rowId));
    setSelectedFieldId((prev) => {
      const fieldInRow = fields.find((f) => f.rowId === rowId && f.id === prev);
      return fieldInRow ? null : prev;
    });
  }

  // ── Mudar nº de colunas (remove campos nas colunas que desaparecem) ──
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

  // ── Atualizar larguras das colunas ───────────────────────────────
  function setRowColWidths(rowId, colWidths) {
    setRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, colWidths } : r)),
    );
  }

  // ── Atualizar altura da linha ────────────────────────────────────
  function setRowHeight(rowId, height) {
    setRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, height } : r)));
  }

  // ── Drag end ────────────────────────────────────────────────────
  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    const overId = String(over.id);
    if (!overId.startsWith("cell::")) return;

    // Formato do ID: "cell::rowId::colIndex"
    const [, rowId, colStr] = overId.split("::");
    const colIndex = parseInt(colStr, 10);

    const targetOccupied = fields.find(
      (f) => f.rowId === rowId && f.colIndex === colIndex,
    );

    // Vem da paleta → criar campo novo
    if (active.data.current?.from === "palette") {
      if (targetOccupied) return; // célula já ocupada
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

    // Vem de outra célula → mover campo
    if (active.data.current?.from === "cell") {
      const fieldId = active.id;
      // Não sobrepor outro campo (a não ser ele próprio)
      if (targetOccupied && targetOccupied.id !== fieldId) return;
      setFields((prev) =>
        prev.map((f) => (f.id === fieldId ? { ...f, rowId, colIndex } : f)),
      );
    }
  }

  // ── Atualizar campo ─────────────────────────────────────────────
  function updateField(id, newData) {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...newData } : f)),
    );
  }

  // ── Eliminar campo ──────────────────────────────────────────────
  function deleteField(id) {
    setFields((prev) => prev.filter((f) => f.id !== id));
    setSelectedFieldId(null);
  }

  // ── Tecla Delete ────────────────────────────────────────────────
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Delete" && selectedFieldId) {
        deleteField(selectedFieldId);
      }
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

    if (fields.length === 0) {
      alert("Adiciona pelo menos um campo antes de guardar.");
      return;
    }

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

  // ── UI ──────────────────────────────────────────────────────────
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
