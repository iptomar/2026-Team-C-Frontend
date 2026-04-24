import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveToken } from "../utils/session";
import "../css/LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.email || !formData.password) {
      setError("Preencha todos os campos.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Introduza um email válido.");
      return;
    }

    if (formData.password.length < 8) {
      setError("A palavra-passe deve ter pelo menos 8 caracteres.");
      return;
    }

    try {
      setLoading(true);

      // TODO: substituir pelo token real quando o backend estiver pronto
      // const data = await loginRequest(formData)
      // saveToken(data.token)
      saveToken("mock-token")

      setSuccess("Login efetuado com sucesso.");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      setError("Erro ao autenticar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Iniciar Sessão</h1>
        <p className="login-subtitle">
          Introduza os seus dados para aceder ao sistema
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="exemplo@email.com"
              className="login-input"
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Palavra-passe</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              className="login-input"
            />
          </div>

          {error && <p className="login-message error-message">{error}</p>}
          {success && <p className="login-message success-message">{success}</p>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "A entrar..." : "Entrar"}
          </button>
        </form>

        <p className="login-register-text">
          Ainda não tem conta?{" "}
          <Link to="/registo" className="login-register-link">
            Registe-se
          </Link>
        </p>
      </div>
    </div>
  );
}