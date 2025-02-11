import React, { useState } from "react";
import "./style.css";

export const Switch = ({ className, text = "3D" }) => {
  const [isOn, setIsOn] = useState(false);

  return (
    <div
      className={`switch ${isOn ? "on" : "off"} ${className}`}
      onClick={() => setIsOn(!isOn)}
    >
      <div className="toggle">
        <div className="ellipse-2" />
      </div>
      <div className="label">{text}</div>
    </div>
  );
};
