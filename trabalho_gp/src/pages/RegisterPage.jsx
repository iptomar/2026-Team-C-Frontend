import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./RegisterPage.css";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function isStrongPassword(password) {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,:_\-])[A-Za-z\d@$!%*?&.,:_\-]{8,}$/;
    return regex.test(password);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Preencha todos os campos.");
      return;
    }

    if (!isStrongPassword(formData.password)) {
      setError(
        "A password deve ter pelo menos 8 caracteres, com maiúscula, minúscula, número e carácter especial."
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("As passwords não coincidem.");
      return;
    }

    setSuccess("Conta criada com sucesso.");

    setTimeout(() => {
navigate("/");
    }, 1000);
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-title">Criar Conta</h1>
        <p className="register-subtitle">
          Preencha os dados para criar a sua conta
        </p>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="register-field">
            <label htmlFor="name">Nome</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="O teu nome"
              className="register-input"
            />
          </div>

          <div className="register-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="exemplo@email.com"
              className="register-input"
            />
          </div>

          <div className="register-field">
            <label htmlFor="password">Palavra-passe</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              className="register-input"
            />
          </div>

          <div className="register-field">
            <label htmlFor="confirmPassword">Confirmar palavra-passe</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="********"
              className="register-input"
            />
          </div>

          {error && <p className="register-message error-message">{error}</p>}
          {success && (
            <p className="register-message success-message">{success}</p>
          )}

          <button type="submit" className="register-button">
            Registar
          </button>
        </form>

        <p className="register-login-text">
          Já tens conta?{" "}
          <Link to="/" className="register-login-link">
            Iniciar sessão
          </Link>
        </p>
      </div>
    </div>
  );
}