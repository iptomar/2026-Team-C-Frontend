import "../css/InstitutionalFooter.css";

export default function InstitutionalFooter() {
  return (
    <footer className="institutional-footer">
<div className="footer-title">
  <span className="footer-number">4.</span>
  <span className="footer-text">O REQUERENTE</span>
</div>

      <div className="footer-content">
        <div className="footer-date">
          <label>Data:</label>
          <div className="footer-line small"></div>
        </div>

        <div className="footer-signature">
          <label>Assinatura</label>
          <div className="footer-line large"></div>
        </div>
      </div>
    </footer>
  );
}