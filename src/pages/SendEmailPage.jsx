import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState , useEffect} from "react";
import "../css/SendEmailPage.css";

export default function SendEmailPage() {
  const [searchParams] = useSearchParams();
  const [hasSentEmail, setHasSentEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Por favor, insira um email válido.");
      return;
    }

    setHasSentEmail(true);
  };

  return (
    <div className="password-container">

      {/* Left panel */}
      <div className="password-left">
        <div className="password-brand">
          <div className="password-brand-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <span>FormDocs</span>
        </div>

        <div className="password-left-content">
          <h2>Recupere o acesso à sua conta</h2>
          <p>Enviaremos um link seguro para o seu email para que possa redefinir a sua palavra-passe.</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="password-right">
        <div className="password-card">

          {hasSentEmail ? (
            <div className="password-success-state">
              <div className="password-success-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92V19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2.08" />
                  <polyline points="22 6 12 13 2 6" />
                </svg>
              </div>
              <h1 className="password-title">Email enviado!</h1>
              <p className="password-subtitle">
                Enviámos um link de recuperação para <strong>{email}</strong>. Verifique a sua caixa de entrada.
              </p>
              <p className="password-hint">Não recebeu o email? Verifique a pasta de spam.</p>
              <button className="password-button" onClick={() => setHasSentEmail(false)}>
                Reenviar email
              </button>
              <p className="password-back-text">
                <Link to="/login" className="password-back-link">← Voltar ao início de sessão</Link>
              </p>
            </div>
          ) : (
            <>
              <h1 className="password-title">Recuperar Palavra-passe</h1>
              <p className="password-subtitle">Insira o seu email para receber um link de recuperação</p>

              <form className="password-form" onSubmit={handleSubmit}>
                <div className="password-field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    placeholder="exemplo@email.com"
                    className="password-input"
                  />
                </div>

                {error && <p className="password-message error-message">{error}</p>}

                <button type="submit" className="password-button">
                  Enviar link de recuperação
                </button>
              </form>

              <p className="password-back-text">
                <Link to="/login" className="password-back-link">← Voltar ao início de sessão</Link>
              </p>
            </>
          )}

        </div>
      </div>

    </div>
  );
}