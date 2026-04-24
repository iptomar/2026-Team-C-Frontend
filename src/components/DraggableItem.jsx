import { useDraggable } from "@dnd-kit/core";
/**
 * COMPONENTE: DraggableItem
 * Este componente representa um item da paleta que "ganha vida" e pode ser arrastado.
 * @param {*} param0 
 * @returns 
 */
export default function DraggableItem({ item }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `palette-${item.type}`,
    data: {
      ...item,
      from: "palette", 
    },
  });

  const style = {
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
      className="tool-item"
    >
      {item.label}
    </div>
  );
}