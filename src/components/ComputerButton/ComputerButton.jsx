// Used to computer Segment #Line intersection
import PropTypes from "prop-types";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";

export const ComputerButton = ({
  className,
  onClick,
  Type,
  isLoading = false,
}) => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    if (isLoading) return;
    setIsActive(true);
    if (onClick) {
      onClick();
    }
    setTimeout(() => setIsActive(false), 300);
  };

  return (
    <button
      className={`btn ${className} ${isActive ? "active" : ""} ${
        isLoading ? "loading" : ""
      }`}
      onClick={handleClick}
      disabled={isLoading}
      aria-label={isLoading ? "Computing..." : `Compute ${Type}`}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#3274f6",
        borderRadius: "10px",
        gap: "7px",
        height: "30px",
        padding: "10px 20px",
        width: "100%",
        color: "white",
        fontSize: "14px",
        fontWeight: "bold",
        border: "none",
        cursor: "pointer",
        transition: "background 0.3s ease-in-out",
      }}
      onMouseOver={(e) => (e.target.style.backgroundColor = "#265ecf")}
      onMouseOut={(e) => (e.target.style.backgroundColor = "#3274f6")}
    >
      {isLoading ? (
        <span className="loading-spinner" role="status" aria-live="polite">
          Computing...
        </span>
      ) : (
        Type
      )}
    </button>
  );
};

ComputerButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  Type: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
};
