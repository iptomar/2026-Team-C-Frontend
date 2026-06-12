import { useState } from "react";
import SegmentedInput from "./SegmentedInput";

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

export function FormField({ field }) {
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
      case "segmented": {
      const currentSegments = field.segments && field.segments.length > 0 ? field.segments : [8, 4];
      const currentSeparator = field.separator !== undefined ? field.separator : "-";

      return (
        // AQUI NÃO PODE TER O pointerEvents: "none"
        <div className="viewform-field">
          <SegmentedInput 
            label={field.label || "Descrição"} 
            segments={currentSegments} 
            separator={currentSeparator} 
          />
        </div>
      );
    }
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
          <div className="viewform-checkbox-group" style={{ flexDirection: field.inline ? "row" : "column" }}>
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
                <input type="text" placeholder="Especifica..." className="viewform-other-input" />
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
        <div className="viewform-field viewform-field-title">
          <h2>{field.label}</h2>
        </div>
      );
      
    case "subtitle":
      return (
        <div className="viewform-field viewform-field-subtitle" style={{ paddingTop: 0 }}>
          <h3>{field.label}</h3>
        </div>
      );
      case "info":
      return (
        <div className="viewform-field viewform-field-info">
          <p>{field.label || "Escreva aqui o seu texto explicativo..."}</p>
        </div>
      );
    default:
      return null;
  }
}
