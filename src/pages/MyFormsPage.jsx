import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../utils/session";
import "../css/MyFormsPage.css";

function authHeaders() {
  const raw = getToken();
  let token;
  try {
    token = JSON.parse(raw).token;
  } catch {
    token = raw;
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function getFieldCount(form) {
  try {
    const estrutura = JSON.parse(form.css);
    return (estrutura.fields || []).length;
  } catch {
    return 0;
  }
}

export default function MyFormsPage() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("ativos");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    isError: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchForms();
  }, []);

  function showToast(message, isError = false) {
    setToast({ show: true, message, isError });

    setTimeout(() => {
      setToast({
        show: false,
        message: "",
        isError: false,
      });
    }, 3000);
  }

async function fetchForms() {
  setLoading(true);
  setError(null);
  
  try {
    const res = await fetch(
      "/api/forms",
      {
        headers: authHeaders(),
      }
    );

    if (!res.ok) {
      throw new Error(
        "Erro ao carregar formulários"
      );
    }

    const data =
      await res.json();

    setForms(data);

  } catch (err) {
    console.error(err);

    setError(
      err.message
    );

  } finally {
    setLoading(false);
  }
}

async function handleDeleteForm(formId) {
  if (
    !window.confirm(
      "Tens a certeza?"
    )
  )
    return;

  try {
    const res =
      await fetch(
        `/api/forms/${formId}`,
        {
          method:
            "DELETE",

          headers:
            authHeaders(),
        }
      );

    if (
      !res.ok
    ) {
      throw new Error(
        "Erro ao eliminar"
      );
    }

    setForms(
      (
        prev
      ) =>
        prev.filter(
          (
            f
          ) =>
            f.id !==
            formId
        )
    );

  } catch (
    err
  ) {
    console.error(
      err
    );
  }
}

async function handleToggleStatus(
  form
) {
  const endpoint =
    form.archived
      ? `/api/forms/${form.id}/unarchive`
      : `/api/forms/${form.id}/archive`;

  try {
    const res =
      await fetch(
        endpoint,
        {
          method:
            "PATCH",

          headers:
            authHeaders(),
        }
      );

    if (
      !res.ok
    ) {
      throw new Error();
    }

    fetchForms();

  } catch {
    alert(
      "Erro"
    );
  }
}

async function handleExportForm(formId) {
  try {
    const res = await fetch(
      `/api/forms/${formId}/export`,
      {
        method: "GET",
        headers: authHeaders(),
      }
    );

    if (!res.ok) {
      throw new Error(
        "Erro ao exportar"
      );
    }

    const blob =
      await res.blob();

    const url =
      window.URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download = `formulario-${formId}.pdf`;

    document.body.appendChild(
      link
    );

    link.click();

    link.remove();

    window.URL.revokeObjectURL(
      url
    );

    showToast(
      "PDF exportado com sucesso."
    );

  } catch (err) {
    console.error(
      err
    );

    showToast(
      "Erro ao exportar formulário.",
      true
    );
  }
}

  const filteredForms = forms.filter(
    (form) => {
      if (activeTab === "todos")
        return true;

      return activeTab ===
        "arquivados"
        ? form.archived
        : !form.archived;
    }
  );

  return (
    
    <div className="myforms-page">

<div className="myforms-topbar">
  <button
    className="back-btn"
    onClick={() => navigate(-1)}
  >
    ← Voltar
  </button>
</div>
      <main className="myforms-content">
        <div className="myforms-container">

          <div className="myforms-list">
            {filteredForms.map(
              (form) => (
                <div
                  key={form.id}
                  className="form-card"
                >

                  <div className="form-card-info">
                    <h3>
                      {form.name}
                    </h3>

                    <p>
                      {
                        getFieldCount(
                          form
                        )
                      }{" "}
                      campos
                    </p>
                  </div>

                  <div className="form-card-actions">

                    <button
                      className="view-btn"
                      onClick={() =>
                        navigate(
                          `/formulario/${form.id}`
                        )
                      }
                    >
                      Ver
                    </button>

                    <button
                      className="edit-btn"
                      onClick={() =>
                        navigate(
                          `/criar-formulario/${form.id}`
                        )
                      }
                    >
                      Editar
                    </button>

                    <button
                      className="archive-btn"
                      onClick={() =>
                        handleToggleStatus(
                          form
                        )
                      }
                    >
                      {form.archived
                        ? "Ativar"
                        : "Arquivar"}
                    </button>

                    {/* NOVO BOTÃO */}
                    <button
                      className="export-btn"
                      onClick={() =>
                        handleExportForm(
                          form.id
                        )
                      }
                    >
                      Exportar
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDeleteForm(
                          form.id
                        )
                      }
                    >
                      Eliminar
                    </button>

                  </div>

                </div>
              )
            )}
          </div>

        </div>
      </main>

      <div
        className={`myforms-toast ${
          toast.show
            ? "show"
            : ""
        } ${
          toast.isError
            ? "toast-error"
            : ""
        }`}
      >
        {toast.message}
      </div>

    </div>
  );
}