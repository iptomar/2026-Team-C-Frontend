import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../css/PasswordResetPage.css";

export default function PasswordResetPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ password: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!formData.password || !formData.confirm) {
      setError("Preencha todos os campos.");
      return;
    }
    if (formData.password.length < 8) {
      setError("A palavra-passe deve ter pelo menos 8 caracteres.");
      return;
    }
    if (formData.password !== formData.confirm) {
      setError("As palavras-passe não coincidem.");
      return;
    }

    setSuccess(true);
    setTimeout(() => navigate("/login"), 3000);
  }

  return (
    <div className="reset-container">

      {/* Left panel */}
      <div className="reset-left">
        <div className="reset-brand">
          <div className="reset-brand-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <span>FormDocs</span>
        </div>

        <div className="reset-left-content">
          <h2>Escolha uma nova palavra-passe</h2>
          <p>A sua nova palavra-passe deve ter pelo menos 8 caracteres e ser diferente da anterior.</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="reset-right">
        <div className="reset-card">

          {success ? (
            <div className="reset-success-state">
              <div className="reset-success-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h1 className="reset-title">Palavra-passe atualizada!</h1>
              <p className="reset-subtitle">A sua palavra-passe foi redefinida com sucesso. Será redirecionado para o início de sessão.</p>
              <p className="reset-hint">A redirecionar em 3 segundos…</p>
              <p className="reset-back-text">
                <Link to="/login" className="reset-back-link">← Ir para o início de sessão</Link>
              </p>
            </div>
          ) : (
            <>
              <h1 className="reset-title">Redefinir Palavra-passe</h1>
              <p className="reset-subtitle">Insira e confirme a sua nova palavra-passe</p>

              <form className="reset-form" onSubmit={handleSubmit}>
                <div className="reset-field">
                  <label htmlFor="password">Nova Palavra-passe</label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="reset-input"
                  />
                </div>

                <div className="reset-field">
                  <label htmlFor="confirm">Confirmar Palavra-passe</label>
                  <input
                    id="confirm"
                    type="password"
                    name="confirm"
                    value={formData.confirm}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="reset-input"
                  />
                </div>

                {formData.password && (
                  <div className="reset-strength">
                    <div className="reset-strength-bars">
                      <span className={`reset-strength-bar ${formData.password.length >= 1 ? "active weak" : ""}`} />
                      <span className={`reset-strength-bar ${formData.password.length >= 8 ? "active medium" : ""}`} />
                      <span className={`reset-strength-bar ${formData.password.length >= 12 && /[^a-zA-Z0-9]/.test(formData.password) ? "active strong" : ""}`} />
                    </div>
                    <span className="reset-strength-label">
                      {formData.password.length < 8
                        ? "Fraca"
                        : formData.password.length < 12 || !/[^a-zA-Z0-9]/.test(formData.password)
                        ? "Média"
                        : "Forte"}
                    </span>
                  </div>
                )}

                {error && <p className="reset-message error-message">{error}</p>}

                <button type="submit" className="reset-button">
                  Redefinir Palavra-passe
                </button>
              </form>

              <p className="reset-back-text">
                <Link to="/login" className="reset-back-link">← Voltar ao início de sessão</Link>
              </p>
            </>
          )}

        </div>
      </div>

    </div>
  );
}