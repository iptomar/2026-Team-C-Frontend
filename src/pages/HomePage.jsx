import { Link } from "react-router-dom";
import "../css/HomePage.css";

export default function HomePage() {
  return (
    <div className="hp-wrapper">

      {/* ── NAV ── */}
      <nav className="hp-nav">
        <div className="hp-nav-brand">
          <div className="hp-nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <span>FormDocs</span>
        </div>
        <div className="hp-nav-actions">
          <Link to="/login" className="hp-nav-login">Iniciar sessão</Link>
          <Link to="/registo" className="hp-nav-register">Criar conta</Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <header className="hp-hero">
        <div className="hp-hero-bg">
          <div className="hp-hero-circle hp-hero-circle--1" />
          <div className="hp-hero-circle hp-hero-circle--2" />
          <div className="hp-hero-circle hp-hero-circle--3" />
        </div>

        <div className="hp-hero-content">
          <div className="hp-hero-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Instituto Politécnico de Tomar
          </div>

          <h1 className="hp-hero-title">
            Gestão de formulários<br />
            <span className="hp-hero-accent">simples e sem papel</span>
          </h1>

          <p className="hp-hero-desc">
            Crie, preencha e submeta pedidos de alteração de aulas e outros
            formulários institucionais — tudo num só lugar, de forma rápida e segura.
          </p>

          <div className="hp-hero-cta">
            <Link to="/registo" className="hp-cta-primary">
              Começar agora
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link to="/login" className="hp-cta-secondary">Já tenho conta</Link>
          </div>
        </div>

        <div className="hp-hero-visual">
          <div className="hp-mockup">
            <div className="hp-mockup-header">
              <span className="hp-mockup-dot" style={{ background: "#ff5f57" }} />
              <span className="hp-mockup-dot" style={{ background: "#febc2e" }} />
              <span className="hp-mockup-dot" style={{ background: "#28c840" }} />
              <span className="hp-mockup-title">Formulário — Alteração de Aula</span>
            </div>
            <div className="hp-mockup-body">
              <div className="hp-mockup-field">
                <span className="hp-mockup-label">Docente</span>
                <div className="hp-mockup-input hp-mockup-input--filled">Prof. João Silva</div>
              </div>
              <div className="hp-mockup-field">
                <span className="hp-mockup-label">Unidade Curricular</span>
                <div className="hp-mockup-input hp-mockup-input--filled">Programação Web</div>
              </div>
              <div className="hp-mockup-row">
                <div className="hp-mockup-field">
                  <span className="hp-mockup-label">Data original</span>
                  <div className="hp-mockup-input hp-mockup-input--filled">12/05/2025</div>
                </div>
                <div className="hp-mockup-field">
                  <span className="hp-mockup-label">Nova data</span>
                  <div className="hp-mockup-input hp-mockup-input--active">19/05/2025</div>
                </div>
              </div>
              <div className="hp-mockup-field">
                <span className="hp-mockup-label">Motivo</span>
                <div className="hp-mockup-textarea">Participação em conferência académica…</div>
              </div>
              <div className="hp-mockup-submit">
                <div className="hp-mockup-btn">Submeter pedido</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── FEATURES ── */}
      <section className="hp-features">
        <div className="hp-features-inner">
          <div className="hp-section-label">Como funciona</div>
          <h2 className="hp-section-title">Tudo o que precisa, num só lugar</h2>

          <div className="hp-features-grid">
            <div className="hp-feature-card">
              <div className="hp-feature-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
              </div>
              <h3>Criar formulários</h3>
              <p>Aceda a modelos pré-definidos para pedidos de alteração de aulas, justificações de faltas e muito mais.</p>
            </div>

            <div className="hp-feature-card">
              <div className="hp-feature-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </div>
              <h3>Preencher e submeter</h3>
              <p>Preencha os campos diretamente na plataforma e submeta os seus pedidos sem precisar de imprimir nada.</p>
            </div>

            <div className="hp-feature-card">
              <div className="hp-feature-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 11 12 14 22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </div>
              <h3>Acompanhar pedidos</h3>
              <p>Consulte o histórico dos seus formulários submetidos e acompanhe o estado de cada pedido em tempo real.</p>
            </div>

            <div className="hp-feature-card">
              <div className="hp-feature-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3>Acesso seguro</h3>
              <p>Os seus dados estão protegidos com autenticação segura. Apenas utilizadores autorizados têm acesso à plataforma.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STEPS ── */}
      <section className="hp-steps">
        <div className="hp-steps-inner">
          <div className="hp-section-label hp-section-label--light">Processo</div>
          <h2 className="hp-section-title hp-section-title--light">Em apenas três passos</h2>

          <div className="hp-steps-grid">
            <div className="hp-step">
              <div className="hp-step-num">01</div>
              <h3>Crie a sua conta</h3>
              <p>Registe-se com o seu email institucional do IPT e aceda à plataforma de imediato.</p>
            </div>
            <div className="hp-step-divider" />
            <div className="hp-step">
              <div className="hp-step-num">02</div>
              <h3>Escolha o formulário</h3>
              <p>Selecione o tipo de pedido que pretende realizar a partir da lista de modelos disponíveis.</p>
            </div>
            <div className="hp-step-divider" />
            <div className="hp-step">
              <div className="hp-step-num">03</div>
              <h3>Submeta o pedido</h3>
              <p>Preencha os dados, reveja e submeta. O pedido é registado e encaminhado automaticamente.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="hp-bottom-cta">
        <h2>Pronto para começar?</h2>
        <p>Crie a sua conta gratuitamente e simplifique a gestão dos seus pedidos institucionais.</p>
        <div className="hp-bottom-cta-btns">
          <Link to="/registo" className="hp-cta-primary">Criar conta grátis</Link>
          <Link to="/login" className="hp-cta-ghost">Iniciar sessão</Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="hp-footer">
        <div className="hp-nav-brand">
          <div className="hp-nav-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <span>FormDocs</span>
        </div>
        <p>© 2025 FormDocs · Instituto Politécnico de Tomar</p>
      </footer>

    </div>
  );
}