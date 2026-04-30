import FormRow from "./FormRow";

/**
 * COMPONENTE: FormCanvas
 * O canvas principal do builder. Em vez de posicionamento absoluto,
 * renderiza uma lista de linhas (rows), cada uma com as suas colunas (cells).
 */
export default function FormCanvas({
  rows,
  fields,
  onAddRow,
  onRemoveRow,
  onSetCols,
  onSetColWidths,
  onSetHeight,
  setSelectedField,
  selectedFieldId,
  onDeleteField,
}) {
  return (
    <div className="canvas-wrapper">
      <div className="form-rows" onClick={() => setSelectedField(null)}>

        {rows.length === 0 && (
          <div className="canvas-empty">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <path d="M3 9h18M9 21V9" />
            </svg>
            <p>Clica em <strong>+ Adicionar linha</strong> para começar</p>
          </div>
        )}

        {rows.map((row) => (
          <FormRow
            key={row.id}
            row={row}
            fields={fields}
            onRemoveRow={onRemoveRow}
            onSetCols={onSetCols}
            onSetColWidths={onSetColWidths}
            onSetHeight={onSetHeight}
            setSelectedField={setSelectedField}
            selectedFieldId={selectedFieldId}
            onDeleteField={onDeleteField}
          />
        ))}

        <button
          className="add-row-btn"
          onClick={(e) => { e.stopPropagation(); onAddRow(); }}
        >
          + Adicionar linha
        </button>

      </div>
    </div>
  );
}
