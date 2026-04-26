import { fieldTypes } from "./fieldTypes";
import DraggableItem from "./DraggableItem";

export default function FieldPalette() {
  return (
    <aside className="sidebar">
      <h3>Campos</h3>
      {fieldTypes.map((item) => (
        <DraggableItem key={item.type} item={item} />
      ))}
    </aside>
  );
}