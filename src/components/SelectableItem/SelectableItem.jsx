// SelectableItem.jsx
import React from "react";
import "./style.css"; // Import styles

const SelectableItem = ({
  text,
  onSelect,
  isSelected,
  className = "", // Allow custom class for the container
  textClassName = "", // Allow custom class for the text
}) => {
  return (
    <div
      className={`selectable-item ${isSelected ? "selected" : ""} ${className}`}
      onClick={onSelect}
    >
      <div className="rectangle-4"></div>
      <div className={`selectable-text ${textClassName}`}>{text}</div>
    </div>
  );
};

export default SelectableItem;
