import "../css/InstitutionalFooter.css";

export default function InstitutionalFooter() {
  return (
    <footer className="institutional-footer">
      <div className="footer-title">
        <span>R E Q U E R E N T E</span>
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