import FormRow from "./FormRow";
import FormSection from "./FormSection";

export default function FormCanvas({
  rows,
  fields,
  sectionTitles,
  setSectionTitles,
  onAddRow,
  onRemoveRow,
  onSetCols,
  onSetColWidths,
  onSetHeight,
  setSelectedField,
  selectedFieldId,
  onDeleteField,
  onAddField,
}) {
  const identificationRows = rows.filter(
    (row) => row.section === "identification"
  );

  const subjectRows = rows.filter(
    (row) => row.section === "subject"
  );

  const foundationRows = rows.filter(
    (row) => !row.section || row.section === "foundation"
  );

  function renderRows(sectionRows) {
    return sectionRows.map((row) => (
      <FormRow
        key={row.id}
        row={row}
        fields={fields}
        onRemoveRow={onRemoveRow}
        onSetCols={onSetCols}
        onSetColWidths={onSetColWidths}
        onSetHeight={onSetHeight}
        setSelectedField={setSelectedField}
        selectedFieldId={selectedFieldId}
        onDeleteField={onDeleteField}
        onAddField={onAddField}
      />
    ));
  }

  function AddRowButton({ section }) {
    return (
      <button
        className="add-row-btn"
        onClick={(e) => {
          e.stopPropagation();
          onAddRow(section);
        }}
      >
        + Adicionar linha
      </button>
    );
  }

  return (
    <div className="canvas-wrapper">
      <div className="form-rows" onClick={() => setSelectedField(null)}>
        <div className="section-builder-area">
          <FormSection
            number="1"
            title={sectionTitles.identification}
            editable
            onTitleChange={(value) =>
              setSectionTitles((prev) => ({
                ...prev,
                identification: value,
              }))
            }
          />

          {renderRows(identificationRows)}

          <AddRowButton section="identification" />
        </div>

        <div className="section-builder-area">
          <FormSection
            number="2"
            title={sectionTitles.subject}
            editable
            onTitleChange={(value) =>
              setSectionTitles((prev) => ({
                ...prev,
                subject: value,
              }))
            }
          />

          {renderRows(subjectRows)}

          <AddRowButton section="subject" />
        </div>

        <div className="section-builder-area">
          <FormSection
            number="3"
            title={sectionTitles.foundation}
            editable
            onTitleChange={(value) =>
              setSectionTitles((prev) => ({
                ...prev,
                foundation: value,
              }))
            }
          />

          {renderRows(foundationRows)}

          <AddRowButton section="foundation" />
        </div>
      </div>
    </div>
  );
}