import { useDroppable, useDraggable } from "@dnd-kit/core";
import FieldRenderer from "./FieldRenderer";

function DraggableField({ field, onClick, isSelected }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: field.id,
    data: {
      ...field,
      from: "canvas",
    },
  });

  const style = {
    position: "absolute",
    left: field.x,
    top: field.y,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`canvas-field ${isSelected ? "selected" : ""}`} // ✅ AQUI
      onMouseDown={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <FieldRenderer field={field} />
    </div>
  );
}

export default function FormCanvas({
  fields,
  setSelectedField,
  selectedFieldId, // ✅ NOVO
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: "form-canvas",
  });

  return (
    <div className="canvas-wrapper">
      <div
        className="text-layer"
        contentEditable
        suppressContentEditableWarning
      />

      <div
        ref={setNodeRef}
        id="form-canvas"
        className={`canvas ${isOver ? "over" : ""}`}
        onMouseDown={() => setSelectedField(null)}
      >
        {fields.map((field) => (
          <DraggableField
            key={field.id}
            field={field}
            onClick={() => setSelectedField(field.id)}
            isSelected={field.id === selectedFieldId}
          />
        ))}
      </div>
    </div>
  );
}