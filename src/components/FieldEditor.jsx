export default function FieldEditor({ field, updateField, deleteField }) {
  if (!field) {
    return (
      <div className="editor">
        <div className="editor-empty">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <path d="M9 12h6M12 9v6" />
          </svg>
          <span>Seleciona um campo para editar</span>
        </div>
      </div>
    );
  }

  return (
    <div className="editor">
      <h3>Editar campo</h3>

      <div className="editor-section">
        <span className="editor-label">Descrição</span>
        <input
          className="editor-input"
          value={field.label}
          onChange={(e) => updateField(field.id, { label: e.target.value })}
          placeholder="Ex: Nome completo"
        />
      </div>

      {(field.type === "text" || field.type === "textarea") && (
        <div className="editor-section">
          <span className="editor-label">Placeholder</span>
          <input
            className="editor-input"
            value={field.placeholder}
            onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
            placeholder="Texto de exemplo"
          />
        </div>
      )}

      {(field.type === "radio" || field.type === "select") && (
        <>
          <hr className="editor-divider" />
          <div className="editor-section">
            <span className="editor-label">Opções</span>
            {field.options.map((opt, i) => (
              <input
                key={i}
                className="editor-input"
                value={opt}
                onChange={(e) => {
                  const newOptions = [...field.options];
                  newOptions[i] = e.target.value;
                  updateField(field.id, { options: newOptions });
                }}
                placeholder={`Opção ${i + 1}`}
              />
            ))}
            <button
              className="editor-add-btn"
              onClick={() => updateField(field.id, { options: [...field.options, "Nova opção"] })}
            >
              + Adicionar opção
            </button>
          </div>
        </>
      )}

      {field.type === "rating" && (
        <div className="editor-section">
          <span className="editor-label">Número de estrelas</span>
          <input
            className="editor-input"
            type="number"
            min="1"
            max="10"
            value={field.stars}
            onChange={(e) => updateField(field.id, { stars: Number(e.target.value) })}
          />
        </div>
      )}

      <hr className="editor-divider" />

      <button
        className="editor-delete-btn"
        onClick={() => deleteField(field.id)}
      >
        Eliminar campo
      </button>
    </div>
  );
}