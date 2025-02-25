import React from "react";
import "./style.css";

export const Line = ({ className, mingcutePenLine, isSelected, onClick }) => {
  return (
    <div
      className={`line ${className} ${isSelected ? "default" : "unselect"}`}
      onClick={onClick}
    >
      <img
        className="mingcute-pen-line"
        alt="Mingcute pen line"
        src={mingcutePenLine}
      />
      <div className="text-wrapper">Line</div>
    </div>
  );
};
