import SegmentedInput from "./SegmentedInput";

export default function FieldRenderer({ field }) {
  const inputStyle = {
    width: "100%",
    display: "block",
    boxSizing: "border-box",
  };

  switch (field.type) {
    case "text":
      return (
        <div>
          <label>{field.label}</label>
          <input type="text" placeholder={field.placeholder} style={inputStyle} />
        </div>
      );

    case "textarea":
      return (
        <div>
          <label>{field.label}</label>
          <textarea placeholder={field.placeholder} style={{ ...inputStyle, minHeight: "60px", resize: "none" }} />
        </div>
      );

    case "number":
      return (
        <div>
          <label>{field.label}</label>
          <input type="number" style={inputStyle} />
        </div>
      );

     case "segmented": {
      const currentSegments = field.segments && field.segments.length > 0 ? field.segments : [8, 4];
      const currentSeparator = field.separator !== undefined ? field.separator : "-";

      return (
        // AQUI MANTÉNS O BLOQUEIO DE CLIQUES
        <div className="viewform-field" style={{ pointerEvents: "none" }}>
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
        <div>
          <label>{field.label}</label>
          <input type="email" placeholder="exemplo@email.com" style={inputStyle} />
        </div>
      );

    case "checkbox":
      return (
        <div>
          <label>{field.label}</label>
          <div style={{ display: "flex", flexDirection: field.inline ? "row" : "column", gap: "4px", marginTop: "4px" }}>
            {(field.options || []).map((opt, i) => (
              <label key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#374151" }}>
                <input type="checkbox" />
                {opt}
              </label>
            ))}
            {field.hasOther && (
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#374151" }}>
                <input type="checkbox" />
                <span>{field.otherLabel || "Outros"}</span>
                <input
                  type="text"
                  placeholder="Especifica..."
                  style={{ border: "none", borderBottom: "1px solid #d1d5db", outline: "none", fontSize: "13px", width: "80px", background: "transparent" }}
                />
              </label>
            )}
          </div>
        </div>
      );

    case "radio":
      return (
        <div>
          <label>{field.label}</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "4px" }}>
            {field.options.map((opt, i) => (
              <label key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#374151" }}>
                <input type="radio" name={field.id} />
                {opt}
              </label>
            ))}
          </div>
        </div>
      );

    case "select":
      return (
        <div>
          <label>{field.label}</label>
          <select style={inputStyle}>
            {field.options.map((opt, i) => (
              <option key={i}>{opt}</option>
            ))}
          </select>
        </div>
      );

    case "date":
      return (
        <div>
          <label>{field.label}</label>
          <input type="date" style={inputStyle} />
        </div>
      );

    case "file":
      return (
        <div>
          <label>{field.label}</label>
          <input type="file" style={inputStyle} />
        </div>
      );

    case "rating":
      return (
        <div>
          <label>{field.label}</label>
          <div style={{ display: "flex", gap: "2px", marginTop: "4px" }}>
            {Array.from({ length: field.stars }).map((_, i) => (
              <span key={i} style={{ fontSize: "18px" }}>⭐</span>
            ))}
          </div>
        </div>
      );

    case "title":
      return (
        <div className="viewform-field viewform-field-title" style={{ pointerEvents: "none" }}>
          <h2>{field.label}</h2>
        </div>
      );
      
    case "subtitle":
      return (
        <div className="viewform-field viewform-field-subtitle" style={{ paddingTop: 0, pointerEvents: "none" }}>
          <h3>{field.label}</h3>
        </div>
      );
      case "info":
      return (
        <div className="viewform-field viewform-field-info" style={{ pointerEvents: "none" }}>
          <p>{field.label || "Escreva aqui o seu texto explicativo..."}</p>
        </div>
      );
    default:
      return null;
  }
}