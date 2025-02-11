/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";
import "./style.css";

export const Indicators = ({
  property1,
  className,
  groupClassName,
  overlapGroupClassName,
  ellipseClassName,
  ellipseClassNameOverride,
}) => {
  return (
    <div className={`indicators ${className}`}>
      <div className={`group ${groupClassName}`}>
        <div className={`overlap-group ${overlapGroupClassName}`}>
          <div className={`ellipse ${ellipseClassName}`} />

          <div className={`div ${ellipseClassNameOverride}`} />
        </div>
      </div>
    </div>
  );
};
