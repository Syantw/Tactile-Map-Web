import React, { useState } from "react";
import "./style.css";

// export const Select = ({ className, antDesignSelect, setDrawingMode }) => {
//   const [isSelected, setIsSelected] = useState(false);

//   const handleClick = () => {
//     setIsSelected(!isSelected);
//     setDrawingMode("select");
//   };

//   return (
//     <div
//       className={`select ${className} ${isSelected ? "default" : "unselect"}`}
//       onClick={handleClick}
//     >
//       <img
//         className="ant-design-select"
//         alt="Ant design select"
//         src={antDesignSelect}
//       />

//       <div className="text-wrapper-2">Select</div>
//     </div>
//   );
// };

export const Select = ({
  className,
  selectIcon,
  drawingMode,
  setDrawingMode,
}) => {
  const isSelected = drawingMode === "select";

  const handleClick = () => {
    setDrawingMode(isSelected ? null : "select");
  };

  return (
    <div
      className={`select ${className} ${isSelected ? "default" : "unselect"}`}
      onClick={handleClick}
    >
      <img className="select-icon" alt="Select Icon" src={selectIcon} />
      <div className="text-wrapper-2">Select</div>
    </div>
  );
};
