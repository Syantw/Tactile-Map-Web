/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";
import { RadioGroup } from "./RadioGroup";
import "./style.css";

export const RadioGroupWrapper = ({
  className,
  radioGroupVector = "/img/vector-21-2.svg",
  radioGroupVectorClassName,
  radioGroupImg = "/img/vector-21-3.svg",
  radioGroupVectorClassNameOverride,
}) => {
  return (
    <div className={`radio-group-wrapper ${className}`}>
      <RadioGroup
        property1="select"
        text="Pencil"
        vector="https://c.animaapp.com/UTvzRI5U/img/vector-21-3.svg"
      />
      <RadioGroup
        img={radioGroupVector}
        property1="unselect"
        text="Pen"
        vectorClassName={radioGroupVectorClassName}
      />
      <RadioGroup
        img={radioGroupImg}
        property1="unselect"
        text="Scissor"
        vectorClassName={radioGroupVectorClassNameOverride}
      />
    </div>
  );
};
