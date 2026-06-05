import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUser } from "../utils/session";
import InstitutionalHeader from "../components/InstitutionalHeader";
import InstitutionalFooter from "../components/InstitutionalFooter";
import FormSection from "../components/FormSection";
import "../css/FillFormPage.css";

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getUser()?.token}`,
  };
}

function FieldInput({ field, value, onChange }) {
  switch (field.type) {
    case "text":
      return (
        <div className="fill-field">
          <label>{field.label}{field.required && <span className="fill-required">*</span>}</label>
          <input type="text" placeholder={field.placeholder} value={value || ""} onChange={(e) => onChange(field.id, e.target.value)} />
        </div>
      );

    case "textarea":
      return (
        <div className="fill-field">
          <label>{field.label}{field.required && <span className="fill-required">*</span>}</label>
          <textarea placeholder={field.placeholder} value={value || ""} onChange={(e) => onChange(field.id, e.target.value)} />
        </div>
      );

    case "number":
      return (
        <div className="fill-field">
          <label>{field.label}{field.required && <span className="fill-required">*</span>}</label>
          <input type="number" value={value || ""} onChange={(e) => onChange(field.id, e.target.value)} />
        </div>
      );

    case "email":
      return (
        <div className="fill-field">
          <label>{field.label}{field.required && <span className="fill-required">*</span>}</label>
          <input type="email" placeholder="exemplo@email.com" value={value || ""} onChange={(e) => onChange(field.id, e.target.value)} />
        </div>
      );

    case "date":
      return (
        <div className="fill-field">
          <label>{field.label}{field.required && <span className="fill-required">*</span>}</label>
          <input type="date" value={value || ""} onChange={(e) => onChange(field.id, e.target.value)} />
        </div>
      );

    case "select":
      return (
        <div className="fill-field">
          <label>{field.label}{field.required && <span className="fill-required">*</span>}</label>
          <select value={value || ""} onChange={(e) => onChange(field.id, e.target.value)}>
            <option value="">Seleciona uma opção</option>
            {field.options?.map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      );

    case "radio":
      return (
        <div className="fill-field">
          <label>{field.label}{field.required && <span className="fill-required">*</span>}</label>
          <div className="fill-radio-group">
            {field.options?.map((opt, i) => (
              <label key={i} className="fill-option">
                <input type="radio" name={field.id} value={opt} checked={value === opt} onChange={() => onChange(field.id, opt)} />
                {opt}
              </label>
            ))}
          </div>
        </div>
      );

    case "checkbox":
      return (
        <div className="fill-field">
          <label>{field.label}{field.required && <span className="fill-required">*</span>}</label>
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
  const [rows, setRows] = useState([]);
  const [fields, setFields] = useState([]);
  const [answers, setAnswers] = useState({});
  const [sectionTitles, setSectionTitles] = useState({
    identification: "Identificação",
    subject: "Assunto | Descrição",
    foundation: "Fundamentação",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", isError: false });

  const isDraftMode = !!submissionId;

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/forms/${id}`, { headers: authHeaders() });
        if (!res.ok) throw new Error("Formulário não encontrado");

        const data = await res.json();
        const estrutura = JSON.parse(data.css || "{}");

        setForm(data);
        setRows(estrutura.rows || []);
        setFields(estrutura.fields || []);

        if (estrutura.sectionTitles) {
          setSectionTitles(estrutura.sectionTitles);
        }

        if (submissionId) {
          const res2 = await fetch(`/api/formsData/${submissionId}`, {
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

  function getFieldsBySection(section) {
    const sectionRowIds = rows
      .filter((row) =>
        section === "foundation"
          ? !row.section || row.section === "foundation"
          : row.section === section
      )
      .map((row) => row.id);

    return fields.filter((field) => sectionRowIds.includes(field.rowId));
  }

  function renderSectionFields(section) {
    const sectionFields = getFieldsBySection(section);

    if (sectionFields.length === 0) {
      return null;
    }

    return sectionFields.map((field) => (
      <FieldInput
        key={field.id}
        field={field}
        value={answers[field.id]}
        onChange={handleChange}
      />
    ));
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
        res = await fetch(`/api/formsData/${submissionId}`, {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify({ answers, isDraft }),
        });
      } else {
        res = await fetch("/api/formsData", {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify(body),
        });
      }

      if (!res.ok) throw new Error("Erro ao guardar o formulário");

      showToast(isDraft ? "Rascunho guardado!" : "Formulário submetido com sucesso!");

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
      <InstitutionalHeader title={form.name} page="Página 1 de 1" />

      <main className="fill-content">
        <div className="fill-container">
          <div className="fill-card">
            <FormSection number="1" title={sectionTitles.identification} />
            {renderSectionFields("identification")}

            <FormSection number="2" title={sectionTitles.subject} />
            {renderSectionFields("subject")}

            <FormSection number="3" title={sectionTitles.foundation} />
            {renderSectionFields("foundation")}
          </div>

          <InstitutionalFooter />

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

      <div className={`fill-toast ${toast.show ? "show" : ""} ${toast.isError ? "toast-error" : ""}`}>
        <span>{toast.message}</span>
      </div>
    </div>
  );
}