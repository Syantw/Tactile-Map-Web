/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";
import "./style.css";

export const TabItem = ({ property1, className }) => {
  return (
    <div className={`tab-item ${property1} ${className}`}>
      <div className="selected-2">
        {property1 === "select-auto" && <>Auto</>}

        {property1 === "unselect-manual" && <>Manual</>}
      </div>
    </div>
  );
};
