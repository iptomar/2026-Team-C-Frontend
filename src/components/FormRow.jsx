import { useRef, useState, useEffect } from "react";
import FormCell from "./FormCell";

/**
 * Input de altura com estado local — só valida ao sair do campo (onBlur),
 * para não interferir com o que o utilizador está a escrever.
 */
const MIN_HEIGHT = 90;

function HeightInput({ value, onChange }) {
  const [raw, setRaw] = useState(value?.toString() ?? "");

  // Sincroniza quando o valor muda externamente (ex: drag)
  useEffect(() => {
    setRaw(value?.toString() ?? "");
  }, [value]);

  function handleChange(e) {
    const val = e.target.value;
    setRaw(val);

    if (!val.trim()) {
      onChange(null); // campo vazio → auto
      return;
    }
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= MIN_HEIGHT) {
      onChange(num); // atualiza em tempo real se válido
    }
    // Se < mínimo enquanto escreve, não atualiza (espera pelo blur)
  }

  function handleBlur() {
    const num = parseInt(raw, 10);
    if (!raw.trim() || isNaN(num) || num <= 0) {
      onChange(null);
      setRaw("");
    } else if (num < MIN_HEIGHT) {
      // Força o mínimo ao sair do campo
      onChange(MIN_HEIGHT);
      setRaw(MIN_HEIGHT.toString());
    } else {
      onChange(num);
      setRaw(num.toString());
    }
  }

  return (
    <div className="row-height-control">
      <input
        className="row-height-input"
        type="number"
        min={MIN_HEIGHT}
        value={raw}
        placeholder="auto"
        title={`Altura da linha (mín. ${MIN_HEIGHT}px)`}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <span className="row-height-unit">px</span>
    </div>
  );
}

/**
 * Input de largura de coluna — só valida ao sair do campo.
 * Distribui o restante igualmente pelas outras colunas.
 */
const MIN_COL = 10;

function ColWidthInput({ colIndex, colWidths, rowId, onSetColWidths }) {
  const [raw, setRaw] = useState(Math.round(colWidths[colIndex]).toString());

  useEffect(() => {
    setRaw(Math.round(colWidths[colIndex]).toString());
  }, [colWidths[colIndex]]);

  function applyWidth(num) {
    const n = colWidths.length;
    const maxPct = 100 - (n - 1) * MIN_COL;
    const clamped = Math.min(maxPct, Math.max(MIN_COL, num));
    const remaining = 100 - clamped;
    const newWidths = colWidths.map((w, i) =>
      i === colIndex ? clamped : remaining / (n - 1)
    );
    onSetColWidths(rowId, newWidths);
    return clamped;
  }

  function handleChange(e) {
    const val = e.target.value;
    setRaw(val);

    const num = parseFloat(val);
    if (!isNaN(num) && num >= MIN_COL) {
      applyWidth(num); // atualiza em tempo real se válido
    }
  }

  function handleBlur() {
    const num = parseFloat(raw);
    if (isNaN(num) || num <= 0) {
      setRaw(Math.round(colWidths[colIndex]).toString());
      return;
    }
    const clamped = applyWidth(num);
    setRaw(Math.round(clamped).toString());
  }

  return (
    <div className="col-width-control">
      <input
        className="col-width-input"
        type="number"
        min={MIN_COL}
        max={100 - (colWidths.length - 1) * MIN_COL}
        value={raw}
        onChange={handleChange}
        onBlur={handleBlur}
        title={`Largura da coluna ${colIndex + 1} (%)`}
      />
      <span className="col-width-unit">%</span>
    </div>
  );
}

/**
 * COMPONENTE: FormRow
 */
export default function FormRow({
  row,
  fields,
  onRemoveRow,
  onSetCols,
  onSetColWidths,
  onSetHeight,
  setSelectedField,
  selectedFieldId,
  onDeleteField,
}) {
  const rowCellsRef = useRef(null);

  // ── Resize de colunas por drag ─────────────────────────────────
  function startColResize(e, colIndex) {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const containerWidth = rowCellsRef.current.getBoundingClientRect().width;
    const startWidths = [...row.colWidths];
    const minPct = 10;

    function onMove(e) {
      const dPct = ((e.clientX - startX) / containerWidth) * 100;

      // Soma das duas colunas adjacentes — mantém-se constante durante o drag
      const totalOfTwo = startWidths[colIndex] + startWidths[colIndex + 1];

      // Clamp: esquerda entre minPct e (total - minPct), garantindo que a direita também fica >= minPct
      const newLeft = Math.max(minPct, Math.min(totalOfTwo - minPct, startWidths[colIndex] + dPct));
      const newRight = totalOfTwo - newLeft;

      const next = [...startWidths];
      next[colIndex] = newLeft;
      next[colIndex + 1] = newRight;

      onSetColWidths(row.id, next);
    }

    function onUp() {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  // ── Resize de altura por drag ──────────────────────────────────
  function startRowResize(e) {
    e.preventDefault();
    e.stopPropagation();

    const startY = e.clientY;
    const startHeight =
      row.height || rowCellsRef.current.getBoundingClientRect().height;

    function onMove(e) {
      onSetHeight(row.id, Math.max(MIN_HEIGHT, startHeight + (e.clientY - startY)));
    }

    function onUp() {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  const gridTemplate = row.colWidths.map((w) => `${w}%`).join(" ");

  return (
    <div className="form-row">

      {/* Controlos principais */}
      <div className="row-controls">
        <span className="row-label">Linha</span>

        <div className="row-col-btns">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              className={`col-btn ${row.colCount === n ? "active" : ""}`}
              onClick={() => onSetCols(row.id, n)}
              title={`${n} coluna${n > 1 ? "s" : ""}`}
            >
              {n}
            </button>
          ))}
        </div>

        <HeightInput value={row.height} onChange={(h) => onSetHeight(row.id, h)} />

        <button
          className="row-remove-btn"
          onClick={() => onRemoveRow(row.id)}
          title="Remover linha"
        >
          ✕
        </button>
      </div>

      {/* Inputs de largura por coluna (só quando há mais de 1 coluna) */}
      {row.colCount > 1 && (
        <div
          className="row-col-width-bar"
          style={{ gridTemplateColumns: gridTemplate }}
        >
          {row.colWidths.map((_, colIndex) => (
            <ColWidthInput
              key={colIndex}
              colIndex={colIndex}
              colWidths={row.colWidths}
              rowId={row.id}
              onSetColWidths={onSetColWidths}
            />
          ))}
        </div>
      )}

      {/* Células */}
      <div
        ref={rowCellsRef}
        className="row-cells"
        style={{
          gridTemplateColumns: gridTemplate,
          height: row.height ? `${row.height}px` : undefined,
          minHeight: row.height ? `${row.height}px` : undefined,
        }}
      >
        {Array.from({ length: row.colCount }, (_, colIndex) => {
          const field =
            fields.find(
              (f) => f.rowId === row.id && f.colIndex === colIndex
            ) ?? null;

          return (
            <div key={colIndex} className="cell-wrapper">
              <FormCell
                rowId={row.id}
                colIndex={colIndex}
                field={field}
                isSelected={field?.id === selectedFieldId}
                setSelectedField={setSelectedField}
                onDeleteField={onDeleteField}
              />

              {colIndex < row.colCount - 1 && (
                <div
                  className="col-resize-handle"
                  onPointerDown={(e) => startColResize(e, colIndex)}
                  title="Arrastar para redimensionar"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Handle de resize de altura */}
      <div
        className="row-resize-handle"
        onPointerDown={startRowResize}
        title="Arrastar para redimensionar altura"
      />

    </div>
  );
}
