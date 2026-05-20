import { useState } from "react";

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

export default function FormRenderer({ rows = [], fields = [] }) {
  return (
    <>
      {rows.map((row) => (
        <div
          key={row.id}
          style={{
            display: "grid",
            gridTemplateColumns: row.colWidths
              ? row.colWidths.map((w) => `${w}%`).join(" ")
              : `repeat(${row.colCount}, 1fr)`,
            gap: "16px",
            marginBottom: "16px",
            alignItems: "start",
          }}
        >
          {Array.from({ length: row.colCount }, (_, colIndex) => {
            const field = fields.find(
              (f) => f.rowId === row.id && f.colIndex === colIndex
            );
            return (
              <div key={colIndex}>
                {field ? <FormField field={field} /> : <div style={{ minHeight: "20px" }} />}
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
}
