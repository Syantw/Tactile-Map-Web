import React, { useState } from "react";
import "./style.css";

export const Line = ({
  className,
  mingcutePenLine,
  drawingMode,
  setDrawingMode,
}) => {
  const isSelected = drawingMode === "line"; // 监听全局 `drawingMode`

  const handleClick = () => {
    setDrawingMode(isSelected ? null : "line"); // 再次点击取消选中
  };

  return (
    <div
      className={`line ${className} ${isSelected ? "default" : "unselect"}`}
      onClick={handleClick}
    >
      <img
        className="mingcute-pen-line"
        alt="Mingcute pen line"
        src={mingcutePenLine}
      />
      <div className="text-wrapper">Line</div>
    </div>
  );
};
