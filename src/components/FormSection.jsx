import "../css/FormSection.css";

export default function FormSection({
  number,
  title,
  editable = false,
  onTitleChange,
}) {
  return (
    <div className="form-section-header">
      <span className="form-section-number">{number}.</span>

      {editable ? (
        <input
          className="form-section-title form-section-input"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
      ) : (
        <span className="form-section-title">{title}</span>
      )}
    </div>
  );
}