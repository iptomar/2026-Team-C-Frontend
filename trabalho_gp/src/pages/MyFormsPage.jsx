import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyFormsPage.css";

export default function MyFormsPage() {
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchForms();
  }, []);

  async function fetchForms() {
    try {
      const response = await fetch("http://localhost:3000/api/forms");
      const data = await response.json();

      if (!response.ok) {
        console.error(data.erro || "Erro ao buscar formulários");
        return;
      }

      setForms(data);
    } catch (error) {
      console.error("Erro ao ligar ao servidor:", error);
    }
  }

  async function handleDeleteForm(formId) {
    const confirmDelete = window.confirm(
      "Tens a certeza que queres eliminar este formulário?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3000/api/forms/${formId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.erro || "Erro ao eliminar formulário.");
        return;
      }

      setForms((prev) => prev.filter((form) => form.id !== formId));
    } catch (error) {
      alert("Erro ao ligar ao servidor.");
      console.error(error);
    }
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
                  <h2 className="form-card-title">{form.name}</h2>

                  <div className="form-card-info">
                    <p>Número de campos: {form.fields?.length || 0}</p>
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