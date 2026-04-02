import { useDroppable, useDraggable } from "@dnd-kit/core";
import FieldRenderer from "./FieldRenderer";

/**
 * COMPONENTE: DraggableField
 * Este é um campo que JÁ ESTÁ no formulário.
 * Ele pode ser movido de um lado para o outro dentro da área de desenho.
 * @param {*} param0 
 * @returns 
 */
function DraggableField({ field }) {
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
      className="canvas-field"
    >
      <FieldRenderer field={field} />
    </div>
  );
}


/**
 * COMPONENTE: FormCanvas
 * Esta é a "folha de papel" ou área onde largas os campos.
 * @param {*} param0 
 * @returns 
 */
export default function FormCanvas({ fields }) {
  const { setNodeRef, isOver } = useDroppable({
    id: "form-canvas",
  });

  return (
    <div className="canvas-wrapper">
      
      {/* 🔥 TEXTO LIVRE */}
      <div
        className="text-layer"
        contentEditable
        suppressContentEditableWarning
      />

      {/* 🔥 CANVAS REAL */}
      <div
        ref={setNodeRef}
        id="form-canvas"
        className={`canvas ${isOver ? "over" : ""}`}
      >
        {fields.map((field) => (
          <DraggableField key={field.id} field={field} />
        ))}
      </div>

    </div>
  );
}