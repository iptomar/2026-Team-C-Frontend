import { useState } from "react";
import { DndContext } from "@dnd-kit/core";

import FormCanvas from "./FormCanvas";
import FieldPalette from "./FieldPalette";
import FieldEditor from "./FieldEditor";
import "./create_forms.css";

export default function Create_form() {
  const [fields, setFields] = useState([]);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedFieldId, setSelectedFieldId] = useState(null);

  const selectedField = fields.find((f) => f.id === selectedFieldId);

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

  function handleDragEnd(event) {
    const { active, delta } = event;

    const canvas = document.getElementById("form-canvas");
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();

    const finalX = dragStart.x + delta.x;
    const finalY = dragStart.y + delta.y;

    const x = finalX - rect.left;
    const y = finalY - rect.top;

    // NOVO
    if (active.data.current?.from === "palette") {
      setFields((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          type: active.data.current.type,
          x,
          y,
          label: "Pergunta",
          placeholder: "Escreve aqui...",
          options: ["Opção 1", "Opção 2"],
          stars: 5,
        },
      ]);
      return;
    }

    // MOVER
    if (active.data.current?.from === "canvas") {
      setFields((prev) =>
        prev.map((field) =>
          field.id === active.id
            ? {
                ...field,
                x: field.x + delta.x,
                y: field.y + delta.y,
              }
            : field
        )
      );
    }
  }

  function updateField(id, newData) {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...newData } : f))
    );
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="builder">
        <FormCanvas
          fields={fields}
          setSelectedField={setSelectedFieldId}
        />

        <FieldPalette />

        <FieldEditor
          field={selectedField}
          updateField={updateField}
        />
      </div>
    </DndContext>
  );
}