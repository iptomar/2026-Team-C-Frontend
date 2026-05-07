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
  const [activeIndex, setActiveIndex] = useState(0);
  const [search, setSearch] = useState("");

  const cellId = `cell::${rowId}::${colIndex}`;
  const { isOver, setNodeRef } = useDroppable({ id: cellId });

  const filteredFields = quickFields.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  function openMenu() {
    setShowMenu(true);
    setActiveIndex(0);
    setSearch("");
  }

  function closeMenu() {
    setShowMenu(false);
    setActiveIndex(0);
    setSearch("");
  }

  function addQuickField(type) {
    onAddField(type, rowId, colIndex);
    closeMenu();
  }

  function handleKeyDown(e) {
    if (e.key === "/" && !field && !showMenu) {
      e.preventDefault();
      openMenu();
      return;
    }

    if (!showMenu) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        filteredFields.length === 0
          ? 0
          : prev === filteredFields.length - 1
          ? 0
          : prev + 1
      );
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        filteredFields.length === 0
          ? 0
          : prev === 0
          ? filteredFields.length - 1
          : prev - 1
      );
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const selected = filteredFields[activeIndex];

      if (selected) {
        addQuickField(selected.type);
      }

      return;
    }

    if (e.key === "Backspace") {
      e.preventDefault();
      setSearch((prev) => prev.slice(0, -1));
      setActiveIndex(0);
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      closeMenu();
      return;
    }

    if (e.key.length === 1) {
      e.preventDefault();
      setSearch((prev) => prev + e.key);
      setActiveIndex(0);
    }
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
          <div className="quick-insert-search">
            /{search || " pesquisar..."}
          </div>

          {filteredFields.length > 0 ? (
            filteredFields.map((item, index) => (
              <button
                key={item.type}
                type="button"
                className={index === activeIndex ? "active" : ""}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={(e) => {
                  e.stopPropagation();
                  addQuickField(item.type);
                }}
              >
                {item.label}
              </button>
            ))
          ) : (
            <div className="quick-insert-empty">
              Nenhum bloco encontrado
            </div>
          )}
        </div>
      )}
    </div>
  );
}