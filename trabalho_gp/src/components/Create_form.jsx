import { useState } from "react";
import { DndContext } from "@dnd-kit/core";

import FormCanvas from "./FormCanvas";
import FieldPalette from "./FieldPalette";
import "./create_forms.css";

/**
 * COMPONENTE PRINCIPAL: Create_form
 * lógica de onde os campos aparecem no ecrã.
 * @returns
 */
export default function Create_form() {

  const [fields, setFields] = useState([]);

  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  /**
   * FUNÇÃO: handleDragStart (Início do Arrasto)
   * Regista as coordenadas iniciais para sabermos de onde o objeto partiu.
   * @param {*} event 
   */
  function handleDragStart(event) {
    const e = event.activatorEvent;

    let clientX = 0;
    let clientY = 0;

    if (e?.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if (e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    setDragStart({ x: clientX, y: clientY });
  }
  /**
   * FUNÇÃO: handleDragEnd (Fim do Arrasto)
   * Decide se deve criar um novo campo ou apenas mover um que já existia.
   * @param {*} event 
   * @returns 
   */
  function handleDragEnd(event) {
    const { active, delta } = event;

    const canvas = document.getElementById("form-canvas");
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();

    const finalX = dragStart.x + delta.x;
    const finalY = dragStart.y + delta.y;

    const x = finalX - rect.left;
    const y = finalY - rect.top;

    // NOVO ITEM
    if (active.data.current?.from === "palette") {
      setFields((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          type: active.data.current.type,
          x,
          y,
        },
      ]);
      return;
    }

    // MOVER EXISTENTE
    if (active.data.current?.from === "canvas") {
      setFields((prev) =>
        prev.map((field) => {
          if (field.id === active.id) {
            return {
              ...field,
              x: field.x + delta.x,
              y: field.y + delta.y,
            };
          }
          return field;
        }),
      );
    }
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="builder">
        <FormCanvas fields={fields} />
        <FieldPalette />
      </div>
    </DndContext>
  );
}
