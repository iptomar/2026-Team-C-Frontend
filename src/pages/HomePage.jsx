import { Link } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  return (
    <div className="home-container">
      <div className="home-card">
        <h1 className="home-title">Bem-vindo</h1>
        <p className="home-subtitle">Sistema de gestão de formulários</p>

        <div className="home-buttons">
          <Link to="/login" className="home-button">
            Iniciar sessão
          </Link>

          <Link to="/registo" className="home-button secondary">
            Criar conta
          </Link>
        </div>
      </div>
    </div>
  );
}