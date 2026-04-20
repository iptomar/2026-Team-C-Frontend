import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../utils/session";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/dashboard";

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard", { replace: true });
    }
  }, []);

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

    try {
      setLoading(true);

      console.log("Login enviado:", formData);

      setSuccess("Login efetuado com sucesso.");
      navigate(from, { replace: true });
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
