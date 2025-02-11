import React from "react";
import "./style.css";

export const MenubarItem = ({ state, className, text, onClick }) => {
  return (
    <div className={`menubar-item ${state} ${className}`} onClick={onClick}>
      <div className="file">{text}</div>
    </div>
  );
};
