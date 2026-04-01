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
      return <input placeholder="Texto curto" />;

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
          <label><input type="radio" name={field.id} /> Opção 1</label>
          <label><input type="radio" name={field.id} /> Opção 2</label>
        </div>
      );

    case "select":
      return (
        <select>
          <option>Opção 1</option>
          <option>Opção 2</option>
        </select>
      );

    case "date":
      return <input type="date" />;

    case "file":
      return <input type="file" />;

    case "rating":
      return <div>⭐⭐⭐⭐⭐</div>;

    case "title":
      return <h2>Título</h2>;

    default:
      return null;
  }
}