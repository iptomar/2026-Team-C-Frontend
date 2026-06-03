import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUser } from "../utils/session";
import InstitutionalHeader from "../components/InstitutionalHeader";
import "../css/FillFormPage.css";

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getUser()?.token}`,
  };
}

function parseFields(form) {
  try {
    const estrutura = JSON.parse(form.css);
    return estrutura.fields || [];
  } catch {
    return [];
  }
}

function FieldInput({ field, value, onChange }) {
  switch (field.type) {
    case "text":
      return (
        <div className="fill-field">
          <label>
            {field.label}
            {field.required && <span className="fill-required">*</span>}
          </label>
          <input
            type="text"
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange(field.id, e.target.value)}
          />
        </div>
      );

    case "textarea":
      return (
        <div className="fill-field">
          <label>
            {field.label}
            {field.required && <span className="fill-required">*</span>}
          </label>
          <textarea
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange(field.id, e.target.value)}
          />
        </div>
      );

    case "number":
      return (
        <div className="fill-field">
          <label>
            {field.label}
            {field.required && <span className="fill-required">*</span>}
          </label>
          <input
            type="number"
            value={value || ""}
            onChange={(e) => onChange(field.id, e.target.value)}
          />
        </div>
      );

    case "email":
      return (
        <div className="fill-field">
          <label>
            {field.label}
            {field.required && <span className="fill-required">*</span>}
          </label>
          <input
            type="email"
            placeholder="exemplo@email.com"
            value={value || ""}
            onChange={(e) => onChange(field.id, e.target.value)}
          />
        </div>
      );

    case "date":
      return (
        <div className="fill-field">
          <label>
            {field.label}
            {field.required && <span className="fill-required">*</span>}
          </label>
          <input
            type="date"
            value={value || ""}
            onChange={(e) => onChange(field.id, e.target.value)}
          />
        </div>
      );

    case "select":
      return (
        <div className="fill-field">
          <label>
            {field.label}
            {field.required && <span className="fill-required">*</span>}
          </label>
          <select
            value={value || ""}
            onChange={(e) => onChange(field.id, e.target.value)}
          >
            <option value="">Seleciona uma opção</option>
            {field.options?.map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      );

    case "radio":
      return (
        <div className="fill-field">
          <label>
            {field.label}
            {field.required && <span className="fill-required">*</span>}
          </label>
          <div className="fill-radio-group">
            {field.options?.map((opt, i) => (
              <label key={i} className="fill-option">
                <input
                  type="radio"
                  name={field.id}
                  value={opt}
                  checked={value === opt}
                  onChange={() => onChange(field.id, opt)}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      );

    case "checkbox":
      return (
        <div className="fill-field">
          <label>
            {field.label}
            {field.required && <span className="fill-required">*</span>}
          </label>

          <div className="fill-checkbox-group">
            {(field.options || []).map((opt, i) => (
              <label key={i} className="fill-option">
                <input
                  type="checkbox"
                  value={opt}
                  checked={(value || []).includes(opt)}
                  onChange={(e) => {
                    const current = value || [];
                    onChange(
                      field.id,
                      e.target.checked
                        ? [...current, opt]
                        : current.filter((v) => v !== opt)
                    );
                  }}
                />
                {opt}
              </label>
            ))}

            {field.hasOther && (
              <label className="fill-option">
                <input
                  type="checkbox"
                  checked={!!value?.other}
                  onChange={(e) =>
                    onChange(field.id, {
                      ...(value || {}),
                      other: e.target.checked
                        ? value?.otherText || ""
                        : undefined,
                    })
                  }
                />
                <span>{field.otherLabel || "Outros"}</span>

                {value?.other !== undefined && (
                  <input
                    type="text"
                    className="fill-other-input"
                    placeholder="Especifica..."
                    value={value?.otherText || ""}
                    onChange={(e) =>
                      onChange(field.id, {
                        ...(value || {}),
                        otherText: e.target.value,
                      })
                    }
                  />
                )}
              </label>
            )}
          </div>
        </div>
      );

    case "title":
      return (
        <div className="fill-field fill-title-field">
          <h2>{field.label}</h2>
        </div>
      );

    default:
      return null;
  }
}

export default function FillFormPage() {
  const { id, submissionId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [fields, setFields] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    isError: false,
  });

  const isDraftMode = !!submissionId;

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/forms/${id}`, {
          headers: authHeaders(),
        });

        if (!res.ok) throw new Error("Formulário não encontrado");

        const data = await res.json();

        setForm(data);
        setFields(parseFields(data));

        if (submissionId) {
          const res2 = await fetch(`/api/submissions/${submissionId}`, {
            headers: authHeaders(),
          });

          if (res2.ok) {
            const sub = await res2.json();
            setAnswers(sub.data?.answers || {});
          }
        }
      } catch (err) {
        showToast(err.message, true);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, submissionId]);

  function showToast(message, isError = false) {
    setToast({ show: true, message, isError });

    setTimeout(() => {
      setToast({ show: false, message: "", isError: false });
    }, 3000);
  }

  function handleChange(fieldId, value) {
    setAnswers((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  }

  async function handleSubmit(isDraft) {
    setSubmitting(true);

    try {
      const body = {
        formId: parseInt(id),
        answers,
        isDraft,
      };

      let res;

      if (isDraftMode) {
        res = await fetch(`/api/submissions/${submissionId}`, {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify({ answers, isDraft }),
        });
      } else {
        res = await fetch("/api/submissions", {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify(body),
        });
      }

      if (!res.ok) throw new Error("Erro ao guardar o formulário");

      showToast(
        isDraft
          ? "Rascunho guardado!"
          : "Formulário submetido com sucesso!"
      );

      if (!isDraft) {
        setTimeout(() => {
          navigate("/inicio/preenchimentos");
        }, 1500);
      }
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="fill-page">
        <div className="fill-loading">A carregar formulário...</div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="fill-page">
        <div className="fill-loading">Formulário não encontrado.</div>
      </div>
    );
  }

  return (
    <div className="fill-page">
      <InstitutionalHeader
        title={form.name}
        page="Página 1 de 1"
      />

      <main className="fill-content">
        <div className="fill-container">
          <div className="fill-card">
            {fields.length === 0 ? (
              <p style={{ color: "#9ca3af", fontSize: "14px" }}>
                Este formulário não tem campos configurados.
              </p>
            ) : (
              fields.map((field) => (
                <FieldInput
                  key={field.id}
                  field={field}
                  value={answers[field.id]}
                  onChange={handleChange}
                />
              ))
            )}
          </div>

          <div className="fill-actions">
            <button
              className="fill-draft-btn"
              onClick={() => handleSubmit(true)}
              disabled={submitting}
            >
              Guardar rascunho
            </button>

            <button
              className="fill-submit-btn"
              onClick={() => handleSubmit(false)}
              disabled={submitting}
            >
              {submitting ? "A submeter..." : "Submeter formulário"}
            </button>
          </div>
        </div>
      </main>

      <div
        className={`fill-toast ${toast.show ? "show" : ""} ${
          toast.isError ? "toast-error" : ""
        }`}
      >
        <span>{toast.message}</span>
      </div>
    </div>
  );
}