import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const CustomButton = ({
  children,
  onClick,
  className = "",
  style = {},
  ...props
}) => {
  // Default button styles
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

  // Merge default styles with user-provided styles
  const mergedStyle = { ...defaultStyle, ...style };

  return (
    <button
      className={`btn ${className}`} // Apply Bootstrap button styles
      style={mergedStyle} // Apply the computed button styles
      onMouseOver={(e) => (e.target.style.backgroundColor = "#265ecf")} // Change background color on hover
      onMouseOut={(e) =>
        (e.target.style.backgroundColor = defaultStyle.backgroundColor)
      } // Reset background color when mouse leaves
      onClick={onClick}
      {...props} // Spread additional props onto the button element
    >
      {children}
    </button>
  );
};

export default CustomButton;
