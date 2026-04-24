import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/MyFormsPage.css";

export default function MyFormsPage() {
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedForms = JSON.parse(localStorage.getItem("myForms")) || [];
    setForms(savedForms);
  }, []);

  function handleDeleteForm(formId) {
    const confirmDelete = window.confirm(
      "Tens a certeza que queres eliminar este formulário?"
    );

    if (!confirmDelete) return;

    const updatedForms = forms.filter((form) => form.id !== formId);
    setForms(updatedForms);
    localStorage.setItem("myForms", JSON.stringify(updatedForms));
  }

  function handleEditForm(formId) {
    navigate(`/criar-formulario/${formId}`);
  }

function handleViewForm(formId) {
  navigate(`/formulario/${formId}`);
}

  return (
    <div className="myforms-page">
      <div className="myforms-container">
        <div className="myforms-header">
          <h1 className="myforms-title">Os meus formulários</h1>

          <div className="myforms-top-actions">
            <button className="back-btn" onClick={() => navigate("/dashboard")}>
              Voltar
            </button>

            <button
              className="new-form-btn"
              onClick={() => navigate("/criar-formulario")}
            >
              Criar novo formulário
            </button>
          </div>
        </div>

        {forms.length === 0 ? (
          <div className="myforms-empty-box">
            <p className="myforms-empty">
              Ainda não tens formulários guardados.
            </p>
            <button
              className="new-form-btn"
              onClick={() => navigate("/criar-formulario")}
            >
              Criar primeiro formulário
            </button>
          </div>
        ) : (
          <div className="myforms-list">
            {forms.map((form) => (
              <div key={form.id} className="form-card">
                <div className="form-card-content">
                  <h2 className="form-card-title">{form.title}</h2>

                  <div className="form-card-info">
                    <p>Número de campos: {form.fields.length}</p>
                    <p>
                      Criado em:{" "}
                      {new Date(form.createdAt).toLocaleDateString("pt-PT")}
                    </p>
                  </div>
                </div>

                <div className="form-card-actions">
                  <button
                    className="view-btn"
                    onClick={() => handleViewForm(form.id)}
                  >
                    Ver
                  </button>

                  <button
                    className="edit-btn"
                    onClick={() => handleEditForm(form.id)}
                  >
                    Editar
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteForm(form.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}