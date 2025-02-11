import React, { useState } from "react";
import "./style.css";

export const Rec = ({ className, materialSymbols, setDrawingMode }) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    setIsSelected(!isSelected);
    setDrawingMode("rectangle");
  };

  return (
    <div
      className={`rec ${className} ${isSelected ? "default" : "unselect"}`}
      onClick={handleClick}
    >
      <img
        className="material-symbols"
        alt="Material symbols"
        src={materialSymbols}
      />

      <div className="text-wrapper-3">Rec</div>
    </div>
  );
};
