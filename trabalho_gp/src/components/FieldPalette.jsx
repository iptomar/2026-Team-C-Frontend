import { fieldTypes } from "./fieldTypes";
import DraggableItem from "./DraggableItem";
/**
 * COMPONENTE: FieldPalette (Paleta de Campos)
 * Funciona como um "catálogo". Ele percorre uma lista de tipos de campos 
 * e cria um botão arrastável para cada um deles.
 * @returns 
 */
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