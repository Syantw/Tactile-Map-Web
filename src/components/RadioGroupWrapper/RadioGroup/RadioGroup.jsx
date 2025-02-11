// import React from "react";
// import "./style.css";

// export const RadioGroup = ({
//   property1,
//   text = "Vertical Line",
//   vector = "https://c.animaapp.com/UTvzRI5U/img/vector-21-3.svg",
//   vectorClassName,
//   img = "/img/vector-21.svg",
// }) => {
//   return (
//     <div className="radio-group">
//       <div className="vertical-line">{text}</div>

//       {property1 === "select" && (
//         <div className="vector-wrapper">
//           <img className="vector" alt="Vector" src={vector} />
//         </div>
//       )}

//       {property1 === "unselect" && (
//         <>
//           <div className="rectangle" />

//           <img className={`img ${vectorClassName}`} alt="Vector" src={img} />
//         </>
//       )}
//     </div>
//   );
// };

import React from "react";
import "./style.css";

export const RadioGroup = ({
  text,
  vector = "https://c.animaapp.com/UTvzRI5U/img/vector-21-5.svg",
  img,
  vectorClassName,
  selectedOptions = [], // 选中的选项（来自父组件）
  onChange, // 选项变更回调
  isControlled = false, // 是否受控
}) => {
  const isSelected = isControlled && selectedOptions.includes(text);

  const handleClick = () => {
    if (isControlled && onChange) {
      onChange(text); // 仅在受控模式下触发 `onChange`
    }
  };

  return (
    <div
      className={`radio-group ${isSelected ? "selected" : ""}`}
      onClick={handleClick}
    >
      <div className="vertical-line">{text}</div>

      {isSelected ? (
        <div className="vector-wrapper">
          <img className="vector" alt="Vector" src={vector} />
        </div>
      ) : (
        <>
          <div className="rectangle" />
          <img className={`img ${vectorClassName}`} alt="Vector" src={img} />
        </>
      )}
    </div>
  );
};
