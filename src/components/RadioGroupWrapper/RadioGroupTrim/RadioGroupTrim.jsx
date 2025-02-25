import React from "react";
import "./style.css";

export const RadioGroupTrim = ({ text, isSelected, onClick, vector, img }) => {
  return (
    <div
      className={`radio-group-trim ${isSelected ? "selected" : ""}`}
      onClick={onClick}
    >
      <div className="vertical-line">{text}</div>
      {isSelected ? (
        <div className="vector-wrapper">
          <img className="vector" alt="Vector" src={vector} />
        </div>
      ) : (
        <>
          <div className="rectangle" />
        </>
      )}
    </div>
  );
};
