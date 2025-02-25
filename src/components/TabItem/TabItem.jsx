import React from "react";
import "./style.css";

export const TabItem = ({ property1, className, onClick }) => {
  return (
    <div className={`tab-item ${property1} ${className}`} onClick={onClick}>
      <div className="selected-2">
        {property1 === "select-auto" && <>Auto</>}
        {property1 === "unselect-auto" && <>Auto</>}
        {property1 === "select-manual" && <>Manual</>}
        {property1 === "unselect-manual" && <>Manual</>}
      </div>
    </div>
  );
};
