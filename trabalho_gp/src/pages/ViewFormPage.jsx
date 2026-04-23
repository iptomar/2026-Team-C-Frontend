import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ViewFormPage() {
  const { id } = useParams();
  const [form, setForm] = useState(null);

  useEffect(() => {
    const savedForms = JSON.parse(localStorage.getItem("myForms")) || [];
    const foundForm = savedForms.find((f) => f.id === id);
    setForm(foundForm);
  }, [id]);

  if (!form) {
    return <p style={{ padding: "40px" }}>Formulário não encontrado.</p>;
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>{form.title}</h1>

      <div style={{ marginTop: "20px" }}>
        {form.fields.map((field) => (
          <div key={field.id} style={{ marginBottom: "20px" }}>
            <label>{field.label}</label>

            {field.type === "text" && (
              <input type="text" placeholder={field.placeholder} />
            )}

            {field.type === "textarea" && (
              <textarea placeholder={field.placeholder}></textarea>
            )}

            {field.type === "number" && <input type="number" />}

            {field.type === "email" && <input type="email" />}

            {field.type === "date" && <input type="date" />}

            {field.type === "select" && (
              <select>
                {field.options?.map((opt, i) => (
                  <option key={i}>{opt}</option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}