import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const CustomButton = ({
  children,
  onClick,
  className = "",
  style = {},
  ...props
}) => {
  const defaultStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3274f6",
    borderRadius: "10px",
    gap: "7px",
    height: "37px",
    padding: "10px 20px",
    width: "100%",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    border: "none",
    cursor: "pointer",
    transition: "background 0.3s ease-in-out",
  };

  const mergedStyle = { ...defaultStyle, ...style };

  return (
    <button
      className={`btn ${className}`}
      style={mergedStyle}
      onMouseOver={(e) => (e.target.style.backgroundColor = "#265ecf")}
      onMouseOut={(e) =>
        (e.target.style.backgroundColor = defaultStyle.backgroundColor)
      }
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default CustomButton;
