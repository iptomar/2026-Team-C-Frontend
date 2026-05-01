import { FormField } from "../pages/ViewFormPage";

export default function FormRenderer({ rows = [], fields = [] }) {
  return (
    <>
      {rows.map((row) => (
        <div
          key={row.id}
          style={{
            display: "grid",
            gridTemplateColumns: row.colWidths
              ? row.colWidths.map((w) => `${w}%`).join(" ")
              : `repeat(${row.colCount}, 1fr)`,
            gap: "16px",
            marginBottom: "16px",
            alignItems: "start",
          }}
        >
          {Array.from({ length: row.colCount }, (_, colIndex) => {
            const field = fields.find(
              (f) =>
                f.rowId === row.id &&
                f.colIndex === colIndex
            );

            return (
              <div key={colIndex}>
                {field ? (
                  <FormField field={field} />
                ) : (
                  <div style={{ minHeight: "20px" }} />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
}