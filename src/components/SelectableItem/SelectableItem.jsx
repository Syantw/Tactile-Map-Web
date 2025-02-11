import React, { useState } from "react";
import "./style.css"; // Import styles

const SelectableItem = ({ text, onSelect, isSelected }) => {
  return (
    <div
      className={`wall-container ${isSelected ? "selected" : ""}`}
      onClick={onSelect}
    >
      <div className="rectangle-4"></div>
      <div className="wall">{text}</div>
    </div>
  );
};

export default SelectableItem;
