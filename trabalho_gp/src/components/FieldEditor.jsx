export default function FieldEditor({ field, updateField }) {
  if (!field) return <div className="editor">Seleciona um campo</div>;

  return (
    <div className="editor">
      <h3>Editar</h3>

      <input
        value={field.label}
        onChange={(e) =>
          updateField(field.id, { label: e.target.value })
        }
        placeholder="Descrição"
      />

      {(field.type === "text" || field.type === "textarea") && (
        <input
          value={field.placeholder}
          onChange={(e) =>
            updateField(field.id, { placeholder: e.target.value })
          }
          placeholder="Placeholder"
        />
      )}

      {(field.type === "radio" || field.type === "select") && (
        <>
          {field.options.map((opt, i) => (
            <input
              key={i}
              value={opt}
              onChange={(e) => {
                const newOptions = [...field.options];
                newOptions[i] = e.target.value;
                updateField(field.id, { options: newOptions });
              }}
            />
          ))}

          <button
            onClick={() =>
              updateField(field.id, {
                options: [...field.options, "Nova opção"],
              })
            }
          >
            + opção
          </button>
        </>
      )}

      {field.type === "rating" && (
        <input
          type="number"
          min="1"
          max="10"
          value={field.stars}
          onChange={(e) =>
            updateField(field.id, { stars: Number(e.target.value) })
          }
        />
      )}
    </div>
  );
}