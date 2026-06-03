import { useState } from "react";
import "../css/InstitutionalHeader.css";

export default function InstitutionalHeader({
  title = "Requerimento",
  documentCode = "PT.SIGQ.MOD ACA 30 20 - 1",
  page = "Página 1 de 1",
}) {
  const [school, setSchool] = useState("");

  const schools = ["ESGT", "ESTA", "ESTT"];

  const handleSchoolChange = (selectedSchool) => {
    setSchool((current) =>
      current === selectedSchool ? "" : selectedSchool
    );
  };

  return (
    <header className="institutional-header">
      <div className="header-top">
        <img
          src="/logo-ipt.png"
          alt="IPT"
          className="header-logo"
        />

        <table className="header-table">
          <tbody>
            <tr>
              <td rowSpan="2" className="header-title">
                {title}
              </td>
              <td className="header-code">
                {documentCode}
              </td>
            </tr>

            <tr>
              <td className="header-page">
                {page}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="school-selector">
        {schools.map((item) => (
          <label key={item} className="school-option">
            <input
              type="checkbox"
              checked={school === item}
              onChange={() => handleSchoolChange(item)}
            />
            <span>{item}</span>
          </label>
        ))}
      </div>
    </header>
  );
}