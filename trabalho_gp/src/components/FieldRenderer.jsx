/**
 * COMPONENTE: FieldRenderer
 * A função deste componente é decidir QUE tipo de campo HTML deve ser desenhado
 * com base na propriedade "type" que ele recebe.
 * @param {*} param0 
 * @returns 
 */
export default function FieldRenderer({ field }) {
  switch (field.type) {
    case "text":
  return (
    <>
      
      <input placeholder={field.placeholder} />
    </>
  );

    case "textarea":
      return <textarea placeholder="Texto longo" />;

    case "number":
      return <input type="number" />;

    case "email":
      return <input type="email" placeholder="Email" />;

    case "checkbox":
      return <label><input type="checkbox" /> Checkbox</label>;

    case "radio":
  return (
    <div>
      
      {field.options.map((opt, i) => (
        <label key={i}>
          <input type="radio" name={field.id} />
          {opt}
        </label>
      ))}
    </div>
  );

    case "select":
  return (
    <>
     
      <select>
        {field.options.map((opt, i) => (
          <option key={i}>{opt}</option>
        ))}
      </select>
    </>
  );

    case "date":
      return <input type="date" />;

    case "file":
      return <input type="file" />;

    case "rating":
  return (
    <div>
      {Array.from({ length: field.stars }).map((_, i) => (
        <span key={i}>⭐</span>
      ))}
    </div>
  );

    case "title":
  return <h2>{field.label}</h2>;

    default:
      return null;
  }
}