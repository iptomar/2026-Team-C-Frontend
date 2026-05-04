import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/RegisterPage.css";

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
  const [loading, setLoading] = useState(false);

  function isStrongPassword(password) {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,:_\-])[A-Za-z\d@$!%*?&.,:_\-]{8,}$/;
    return regex.test(password);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const { password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setError("Preencha todos os campos.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Introduza um email válido.");
      return;
    }

    if (!isStrongPassword(password)) {
      setError("A password deve ter pelo menos 8 caracteres, com maiúscula, minúscula, número e carácter especial.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As passwords não coincidem.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao registar utilizador.");
        return;
      }

      setSuccess(data.message || "Conta criada com sucesso.");
      setTimeout(() => navigate("/"), 1000);
    } catch {
      setError("Erro ao ligar ao servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-container">

      {/* Painel esquerdo */}
      <div className="register-left">
        <div className="register-brand">
          <div className="register-brand-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <span>FormDocs</span>
        </div>

        <div className="register-left-content">
          <h2>Crie a sua conta e comece agora</h2>
          <p>Registe-se para aceder à plataforma e gerir os seus formulários de forma simples e rápida.</p>
        </div>
      </div>

      {/* Painel direito */}
      <div className="register-right">
        <div className="register-card">
          <h1 className="register-title">Criar Conta</h1>
          <p className="register-subtitle">Preencha os dados para se registar</p>

          <form onSubmit={handleSubmit} className="register-form">
            <div className="register-field">
              <label htmlFor="name">Nome</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="O seu nome"
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
                placeholder="••••••••"
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
                placeholder="••••••••"
                className="register-input"
              />
            </div>

            {error && <p className="register-message error-message">{error}</p>}
            {success && <p className="register-message success-message">{success}</p>}

            <button type="submit" className="register-button" disabled={loading}>
              {loading ? "A registar..." : "Criar conta"}
            </button>
          </form>

          <p className="register-login-text">
            Já tem conta?{" "}
            <Link to="/login" className="register-login-link">Iniciar sessão</Link>
          </p>
        </div>
      </div>

    </div>
  );
}