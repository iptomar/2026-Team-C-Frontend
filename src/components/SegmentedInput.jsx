import React, { useState, useRef, useEffect } from "react";
import "../css/SegmentedInput.css";

export default function SegmentedInput({
  label = "Descrição",
  segments = [8, 4],
  separator = "-",
  onChange
}) {
  // Garante que segments é um array válido para evitar erros
  const validSegments = Array.isArray(segments) && segments.length > 0 ? segments : [8, 4];
  const totalLength = validSegments.reduce((acc, val) => acc + val, 0);

  const [value, setValue] = useState(Array(totalLength).fill(""));
  const inputRefs = useRef([]);

  // Se alterares a quantidade de caixas no editor, isto sincroniza o estado e impede bugs
  useEffect(() => {
    setValue((prev) => {
      if (prev.length === totalLength) return prev;
      const newVal = Array(totalLength).fill("");
      for (let i = 0; i < Math.min(prev.length, totalLength); i++) {
        newVal[i] = prev[i];
      }
      return newVal;
    });
  }, [totalLength]);

  const handleChange = (e, index) => {
    const val = e.target.value;
    // Pega sempre no último caractere (permite escrever por cima de um já existente)
    const char = val.slice(-1);

    const newValue = [...value];
    newValue[index] = char;
    setValue(newValue);

    if (onChange) {
      onChange(newValue.join(""));
    }

    // Se inseriu um caractere, salta logo para a próxima caixa
    if (char !== "" && index < totalLength - 1) {
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newValue = [...value];

      if (newValue[index]) {
        // Se a caixa atual tem texto, apaga apenas esse texto
        newValue[index] = "";
        setValue(newValue);
        if (onChange) onChange(newValue.join(""));
      } else if (index > 0) {
        // Se está vazia, volta para a caixa anterior e apaga-a
        newValue[index - 1] = "";
        setValue(newValue);
        if (onChange) onChange(newValue.join(""));
        const prevInput = inputRefs.current[index - 1];
        if (prevInput) prevInput.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < totalLength - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    // Limpa espaços ou caracteres estranhos, mantém letras e números
    const pastedData = e.clipboardData.getData("Text").replace(/[^a-zA-Z0-9]/g, ""); 

    const newValue = [...value];
    for (let i = 0; i < pastedData.length && i < totalLength; i++) {
      newValue[i] = pastedData[i];
    }

    setValue(newValue);
    if (onChange) onChange(newValue.join(""));

    // Move o cursor para o fim da colagem
    const nextIndex = Math.min(pastedData.length, totalLength - 1);
    if (inputRefs.current[nextIndex]) {
      inputRefs.current[nextIndex].focus();
    }
  };

  // Calcula o index verdadeiro de forma segura
  const getIndex = (groupIndex, itemIndex) => {
    let offset = 0;
    for (let i = 0; i < groupIndex; i++) {
      offset += validSegments[i];
    }
    return offset + itemIndex;
  };

  return (
    <div className="segmented-wrapper">
      {label && <label className="segmented-label">{label}</label>}

      <div className="segmented-container" onPaste={handlePaste}>
        {validSegments.map((segLength, groupIdx) => (
          <React.Fragment key={groupIdx}>
            <div className="segmented-group">
              {Array.from({ length: segLength }).map((_, itemIdx) => {
                const currentIndex = getIndex(groupIdx, itemIdx);
                return (
                  <input
                    key={currentIndex}
                    ref={(el) => (inputRefs.current[currentIndex] = el)}
                    type="text"
                    className="segmented-square"
                    value={value[currentIndex] || ""} // o || "" previne o erro de Uncontrolled Input
                    onChange={(e) => handleChange(e, currentIndex)}
                    onKeyDown={(e) => handleKeyDown(e, currentIndex)}
                    onFocus={(e) => e.target.select()}
                  />
                );
              })}
            </div>

            {groupIdx < validSegments.length - 1 && separator && (
              <span className="segmented-separator">{separator}</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}