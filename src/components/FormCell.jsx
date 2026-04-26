import { useDroppable, useDraggable } from "@dnd-kit/core";
import FieldRenderer from "./FieldRenderer";

/**
 * Campo arrastável dentro de uma célula
 */
function DraggableCellField({ field, isSelected, onClick, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
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
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
      {/* Handle de drag */}
      <div className="cell-field-drag" {...listeners} {...attributes} title="Arrastar">
        ⠿
      </div>

      {/* Conteúdo do campo */}
      <div className="cell-field-content">
        <FieldRenderer field={field} />
      </div>

      {/* Botão de eliminar */}
      <button
        className="cell-field-delete"
        onMouseDown={(e) => { e.stopPropagation(); onDelete(); }}
        title="Eliminar campo"
      >
        ✕
      </button>
    </div>
  );
}

/**
 * COMPONENTE: FormCell
 * Uma célula individual dentro de uma linha. É uma zona droppable.
 * Se estiver vazia, mostra um placeholder. Se tiver um campo, mostra-o.
 */
export default function FormCell({ rowId, colIndex, field, isSelected, setSelectedField, onDeleteField }) {
  const cellId = `cell::${rowId}::${colIndex}`;
  const { isOver, setNodeRef } = useDroppable({ id: cellId });

  return (
    <div
      ref={setNodeRef}
      className={`form-cell ${isOver && !field ? "over" : ""} ${field ? "occupied" : "empty"}`}
      onClick={() => { if (!field) setSelectedField(null); }}
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
    </div>
  );
}
