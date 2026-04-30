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
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "4px" }}>
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
      return <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#111827" }}>{field.label}</h2>;

    default:
      return null;
  }
}