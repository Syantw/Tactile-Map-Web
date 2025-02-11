import React from "react";
import "./style.css";

export const StateSelectedWrapper = ({
  state,
  className,
  text = "Selected",
  text1 = "Unselected",
}) => {
  return (
    <div className={`state-selected-wrapper state-${state} ${className}`}>
      <div className="selected-3">
        {state === "selected" && <>{text}</>}

        {state === "unselected" && <>{text1}</>}
      </div>
    </div>
  );
};
