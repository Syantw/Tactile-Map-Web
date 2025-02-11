import PropTypes from "prop-types";
import React, { useState } from "react";
import "./style.css";

export const ComputerButton = ({ className, onClick, Type }) => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
    if (onClick) {
      onClick(); // 触发交点计算
    }
  };

  return (
    <div
      className={`computer-button ${
        isActive ? "action" : "default"
      } ${className}`}
      onClick={handleClick}
    >
      <div className="text-wrapper">{Type}</div>
    </div>
  );
};

ComputerButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func, // 添加点击回调
};
