import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUser } from "../utils/session";
import InstitutionalHeader from "../components/InstitutionalHeader";
import InstitutionalFooter from "../components/InstitutionalFooter";
import FormSection from "../components/FormSection";
import "../css/FillFormPage.css";

// Controlled segmented input — mirrors SegmentedInput.jsx but tied to fill-form value/onChange
function FillSegmentedInput({ field, value, onChange }) {
  const segments = field.segments?.length > 0 ? field.segments : [parseInt(field.segmentsRaw, 10) || 1];
  const separator = field.separator !== undefined ? field.separator : "";
  const totalLen = segments.reduce((a, b) => a + b, 0);

  const chars = Array.from({ length: totalLen }, (_, i) => (value || "")[i] || "");
  const refs = useRef([]);
  refs.current = [];

  function handleChange(i, e) {
    const char = e.target.value.slice(-1);
    const next = [...chars];
    next[i] = char;
    onChange(field.id, next.join(""));
    if (char && i < totalLen - 1) refs.current[i + 1]?.focus();
  }

  function handleKeyDown(i, e) {
    if (e.key === "Backspace" && !chars[i] && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowLeft"  && i > 0)             refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < totalLen - 1)  refs.current[i + 1]?.focus();
  }

  let flat = 0;
  const groups = segments.map((count) => {
    const squares = [];
    for (let i = 0; i < count; i++) {
      const fi = flat++;
      squares.push(
        <input
          key={fi}
          style={{borderWidth: "1px"}}
          ref={(el) => { if (el) refs.current[fi] = el; }}
          className="segmented-square"
          type="text"
          maxLength={1}
          value={chars[fi]}
          onChange={(e) => handleChange(fi, e)}
          onKeyDown={(e) => handleKeyDown(fi, e)}
          
        />
      );
    }
    return squares;
  });

  return (
    <div className="fill-field">
      <label>{field.label}{field.required && <span className="fill-required">*</span>}</label>
      <div className="segmented-wrapper">
        <div className="segmented-container">
          {groups.map((grp, gi) => (
            <span key={gi} style={{ display: "contents" }}>
              <div className="segmented-group">{grp}</div>
              {gi < groups.length - 1 && separator && (
                <span className="segmented-separator">{separator}</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

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
          <div className="fill-checkbox-group" style={{flexDirection : field.inline ? "row" : "column"}}>
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

    case "segmented":
      return <FillSegmentedInput field={field} value={value} onChange={onChange} />;

    case "title":
      return (
        <div className="fill-field fill-title-field">
          <h2>{field.label}</h2>
        </div>
      );

    case "subtitle":
      return (
        <div className="fill-field viewform-field-subtitle" style={{ paddingTop: 0 }}>
          <h3>{field.label}</h3>
        </div>
      );

    case "info":
      return (
        <div className="fill-field viewform-field-info">
          <p>{field.label}</p>
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

  function renderSectionFields(section) {
    // Get rows belonging to this section, in order
    const sectionRows = rows.filter((row) =>
      section === "foundation"
        ? !row.section || row.section === "foundation"
        : row.section === section
    );

    if (sectionRows.length === 0) return null;

    return sectionRows.map((row) => {
      // Build colWidths into a CSS grid template
      const colWidths = row.colWidths || Array(row.colCount).fill(100 / row.colCount);
      const gridTemplate = colWidths.map((w) => `${w}fr`).join(" ");

      // Map colIndex -> field for this row
      const colMap = {};
      fields
        .filter((f) => f.rowId === row.id)
        .forEach((f) => { colMap[f.colIndex] = f; });

      return (
        <div
          key={row.id}
          style={{
            display: "grid",
            gridTemplateColumns: gridTemplate,
            gap: "16px",
            alignItems: "start",
            marginBottom: "1px",
          }}
        >
          {Array.from({ length: row.colCount }, (_, i) => (
            <div key={i}>
              {colMap[i] ? (
                <FieldInput
                  field={colMap[i]}
                  value={answers[colMap[i].id]}
                  onChange={handleChange}
                />
              ) : null}
            </div>
          ))}
        </div>
      );
    });
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