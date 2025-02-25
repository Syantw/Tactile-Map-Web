import React from "react";
import "./style.css";

export const RadioGroup = ({
  text,
  vector = "https://c.animaapp.com/UTvzRI5U/img/vector-21-5.svg",
  vectorClassName,
  selectedOptions = [],
  onChange,
}) => {
  const isSelected = selectedOptions.includes(text);

  const handleClick = () => {
    if (onChange) {
      onChange(text);
    }
  };

  return (
    <div
      className={`radio-group ${isSelected ? "selected" : ""}`}
      onClick={handleClick}
    >
      <div className="vertical-line">{text}</div>
      {isSelected ? (
        <div className="vector-wrapper">
          <img
            className={`vector ${vectorClassName}`}
            alt="Vector"
            src={vector}
          />
        </div>
      ) : (
        <div className="rectangle" />
      )}
    </div>
  );
};
