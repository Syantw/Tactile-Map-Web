import React from "react";
import "./style.css";

export const Select = ({ className, selectIcon, isSelected, onClick }) => {
  return (
    <div
      className={`select ${className} ${isSelected ? "default" : "unselect"}`}
      onClick={onClick}
    >
      <img className="select-icon" alt="Select Icon" src={selectIcon} />
      <div className="text-wrapper-2">Select</div>
    </div>
  );
};
