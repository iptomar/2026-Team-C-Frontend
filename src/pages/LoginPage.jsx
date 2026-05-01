import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveToken } from "../utils/session";
import "../css/LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      const text = await response.text();

      if (!text) {
        throw new Error("O servidor não devolveu resposta.");
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Resposta inválida do servidor.");
      }

      if (!response.ok) {
        throw new Error(data.error || "Erro ao autenticar.");
      }

      saveToken(data.token);
      setSuccess("Login efetuado com sucesso.");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      setError(err.message || "Erro ao autenticar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">

      {/* Painel esquerdo */}
      <div className="login-left">
        <div className="login-brand">
          <div className="login-brand-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <span>FormDocs</span>
        </div>

        <div className="login-left-content">
          <h2>Gestão de formulários simples e rápida</h2>
          <p>Aceda à plataforma para criar e gerir os seus formulários de alteração de aulas e outros pedidos.</p>
        </div>
      </div>

      {/* Painel direito */}
      <div className="login-right">
        <div className="login-card">
          <h1 className="login-title">Iniciar Sessão</h1>
          <p className="login-subtitle">Introduza os seus dados para continuar</p>

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
                placeholder="••••••••"
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
            <Link to="/registo" className="login-register-link">Registe-se</Link>
          </p>
          <p className="login-register-text">
            Esqueci-me da password -{" "}
            <Link to="/passwd" className="login-register-link">Recuperar</Link>
          </p>
        </div>
      </div>

    </div>
  );
}
