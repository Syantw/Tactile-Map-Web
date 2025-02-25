import React from "react";
import { RadioGroupTrim } from "./RadioGroupTrim/RadioGroupTrim";
import "./style.css";

export const RadioGroupWrapper = ({
  className,
  radioGroupVector = "https://c.animaapp.com/UTvzRI5U/img/vector-21-3.svg",
  radioGroupImg = "/img/vector-21-5.svg",
  radioGroupVectorClassName,
  radioGroupVectorClassNameOverride,
  onToolSelect,
  selectedTool,
}) => {
  return (
    <div className={`radio-group-wrapper ${className}`}>
      <RadioGroupTrim
        text="Pencil"
        isSelected={selectedTool === "pencil"}
        onClick={() => onToolSelect("pencil")}
        vector="https://c.animaapp.com/UTvzRI5U/img/vector-21-3.svg"
        img="/img/vector-21-5.svg"
      />
      <RadioGroupTrim
        text="Pen"
        isSelected={selectedTool === "pen"}
        onClick={() => onToolSelect("pen")}
        vector="https://c.animaapp.com/UTvzRI5U/img/vector-21-3.svg"
        img="/img/vector-21-5.svg"
      />
      <RadioGroupTrim
        text="Scissor"
        isSelected={selectedTool === "scissor"}
        onClick={() => onToolSelect("scissor")}
        vector="https://c.animaapp.com/UTvzRI5U/img/vector-21-3.svg"
        img="/img/vector-21-5.svg"
      />
    </div>
  );
};
