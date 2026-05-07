import { useState } from "react";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import FieldRenderer from "./FieldRenderer";

const quickFields = [
  { label: "Texto curto", type: "text" },
  { label: "Texto longo", type: "textarea" },
  { label: "Número", type: "number" },
  { label: "Email", type: "email" },
  { label: "Checkbox", type: "checkbox" },
  { label: "Escolha única", type: "radio" },
  { label: "Dropdown", type: "select" },
  { label: "Data", type: "date" },
  { label: "Upload", type: "file" },
  { label: "Estrelas", type: "rating" },
  { label: "Título", type: "title" },
];

function DraggableCellField({ field, isSelected, onClick, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: field.id,
      data: { ...field, from: "cell" },
    });

  const style = {
    opacity: isDragging ? 0.35 : 1,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`cell-field ${isSelected ? "selected" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <div
        className="cell-field-drag"
        {...listeners}
        {...attributes}
        title="Arrastar"
      >
        ⠿
      </div>

      <div className="cell-field-content">
        <FieldRenderer field={field} />
      </div>

      <button
        className="cell-field-delete"
        onMouseDown={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        title="Eliminar campo"
      >
        ✕
      </button>
    </div>
  );
}

export default function FormCell({
  rowId,
  colIndex,
  field,
  isSelected,
  setSelectedField,
  onDeleteField,
  onAddField,
}) {
  const [showMenu, setShowMenu] = useState(false);

  const cellId = `cell::${rowId}::${colIndex}`;
  const { isOver, setNodeRef } = useDroppable({ id: cellId });

  function handleKeyDown(e) {
    if (e.key === "/" && !field) {
      e.preventDefault();
      setShowMenu(true);
    }

    if (e.key === "Escape") {
      setShowMenu(false);
    }
  }

  function addQuickField(type) {
    onAddField(type, rowId, colIndex);
    setShowMenu(false);
  }

  return (
    <div
      ref={setNodeRef}
      tabIndex={0}
      className={`form-cell ${isOver && !field ? "over" : ""} ${
        field ? "occupied" : "empty"
      }`}
      onClick={() => {
        if (!field) setSelectedField(null);
      }}
      onKeyDown={handleKeyDown}
      style={{ position: "relative" }}
    >
      {field ? (
        <DraggableCellField
          field={field}
          isSelected={isSelected}
          onClick={() => setSelectedField(field.id)}
          onDelete={() => onDeleteField(field.id)}
        />
      ) : (
        <div className="cell-placeholder">
          {isOver ? "⬇ Largar aqui" : "Arrastar campo aqui"}
        </div>
      )}

      {showMenu && !field && (
        <div className="quick-insert-menu">
          {quickFields.map((item) => (
            <button
              key={item.type}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                addQuickField(item.type);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}