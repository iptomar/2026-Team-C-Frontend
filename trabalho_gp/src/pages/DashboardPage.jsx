import { Link, useNavigate } from "react-router-dom";
import "./DashboardPage.css";

export default function DashboardPage() {
  const navigate = useNavigate();

  function handleLogout() {
    navigate("/login");
  }

  function handleCreateForm() {
    alert("Funcionalidade de criar formulário em desenvolvimento.");
  }

  function handleMyForms() {
    alert("Página de formulários em desenvolvimento.");
  }

  function handleResponses() {
    alert("Página de respostas em desenvolvimento.");
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1 className="dashboard-title">Área do Docente</h1>
        <p className="dashboard-subtitle">
          Permite gerar formulários de forma simples e automática
        </p>

        <div className="dashboard-grid">
          <button className="dashboard-box primary" onClick={handleCreateForm}>
            <h2>Criar formulário</h2>
            <p>Criar um novo formulário para os alteração de aulas, por exemplo.</p>
          </button>

          <button className="dashboard-box" onClick={handleMyForms}>
            <h2>Os meus formulários</h2>
            <p>Consultar e gerir formulários já criados.</p>
          </button>

          <button className="dashboard-box" onClick={handleResponses}>
            <h2>Ver respostas</h2>
            <p>Consultar respostas submetidas pela Administração.</p>
          </button>

          <button className="dashboard-box logout" onClick={handleLogout}>
            <h2>Terminar sessão</h2>
            <p>Sair da conta e voltar à página de login.</p>
          </button>
        </div>

      </div>
    </div>
  );
}