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
        <span className="editor-label">
          {field.type === "info" ? "Texto a apresentar" : "Descrição"}
        </span>
        
        {field.type === "info" ? (
          <textarea
            className="editor-input"
            style={{ minHeight: "90px", resize: "vertical", padding: "8px" }}
            value={field.label}
            onChange={(e) => updateField(field.id, { label: e.target.value })}
            placeholder="Escreva as instruções ou texto estático aqui..."
          />
        ) : (
          <input
            className="editor-input"
            value={field.label}
            onChange={(e) => updateField(field.id, { label: e.target.value })}
            placeholder="Ex: Nome completo"
          />
        )}
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

      {/* --- INÍCIO DA CONFIGURAÇÃO DO SEGMENTED INPUT --- */}
      {field.type === "segmented" && (
        <>
          <div className="editor-section">
            <span className="editor-label">Formato das Caixas (ex: 8,4)</span>
            <input
              className="editor-input"
              placeholder="Ex: 8,4 ou 4,3,4"
              value={field.segmentsRaw !== undefined ? field.segmentsRaw : (field.segments ? field.segments.join(",") : "8,4")}
              onChange={(e) => {
                const raw = e.target.value;
                // Converte a string "8,4" num array de números [8, 4]
                const parsed = raw
                  .split(",")
                  .map((s) => parseInt(s.trim(), 10))
                  .filter((n) => !isNaN(n) && n > 0);
                
                updateField(field.id, { 
                  segmentsRaw: raw, // Guarda o texto exato para não apagar a vírgula enquanto se escreve
                  segments: parsed.length > 0 ? parsed : [1] 
                });
              }}
            />
            <small style={{ color: "#9ca3af", fontSize: "11px", display: "block", marginTop: "4px" }}>
              Separa por vírgulas para criar grupos. Ex: 4,3,4.
            </small>
          </div>

          <div className="editor-section">
            <span className="editor-label">Separador</span>
            <input
              className="editor-input"
              maxLength={3}
              placeholder="Ex: - ou / (vazio para nenhum)"
              value={field.separator !== undefined ? field.separator : "-"}
              onChange={(e) => updateField(field.id, { separator: e.target.value })}
            />
          </div>
        </>
      )}
      {/* --- FIM DA CONFIGURAÇÃO DO SEGMENTED INPUT --- */}

      {(field.type === "radio" || field.type === "select" || field.type === "checkbox") && (
        <>
          <hr className="editor-divider" />
          <div className="editor-section">
            <span className="editor-label">Opções</span>
            {field.options.map((opt, i) => (
              <div key={i} className="editor-option-row">
                <input
                  className="editor-input"
                  value={opt}
                  onChange={(e) => {
                    const newOptions = [...field.options];
                    newOptions[i] = e.target.value;
                    updateField(field.id, { options: newOptions });
                  }}
                  placeholder={`Opção ${i + 1}`}
                />
                <button
                  className="editor-option-remove"
                  disabled={field.options.length <= 1}
                  onClick={() => {
                    const newOptions = field.options.filter((_, j) => j !== i);
                    updateField(field.id, { options: newOptions });
                  }}
                  title="Remover opção"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              className="editor-add-btn"
              onClick={() => updateField(field.id, { options: [...field.options, "Nova opção"] })}
            >
              + Adicionar opção
            </button>
          </div>

          {field.type === "checkbox" && (
            <>
              <hr className="editor-divider" />
              <div className="editor-section">
                <label className="editor-required">
                  <input
                    type="checkbox"
                    checked={!!field.inline}
                    onChange={(e) => updateField(field.id, { inline: e.target.checked })}
                  />
                  Em linha
                </label>
              </div>

              <div className="editor-section">
                <label className="editor-required">
                  <input
                    type="checkbox"
                    checked={!!field.hasOther}
                    onChange={(e) => updateField(field.id, { hasOther: e.target.checked })}
                  />
                  Incluir opção "Outros"
                </label>
                {field.hasOther && (
                  <>
                    <span className="editor-label" style={{ marginTop: "6px" }}>Texto da opção</span>
                    <input
                      className="editor-input"
                      value={field.otherLabel || ""}
                      onChange={(e) => updateField(field.id, { otherLabel: e.target.value })}
                      placeholder="Ex: Outros"
                    />
                  </>
                )}
              </div>
            </>
          )}
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

{field.type !== "title" && (
  <>
    <hr className="editor-divider" />

    <div className="editor-section">
      <label className="editor-required">
        <input
          type="checkbox"
          checked={!!field.required}
          onChange={(e) =>
            updateField(field.id, {
              required: e.target.checked,
            })
          }
        />
        Campo obrigatório
      </label>
    </div>
  </>
)}


      <button
        className="editor-delete-btn"
        onClick={() => deleteField(field.id)}
      >
        Eliminar campo
      </button>
    </div>
  );
}