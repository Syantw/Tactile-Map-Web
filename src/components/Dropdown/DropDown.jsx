import PropTypes from "prop-types";
import React from "react";
import "./style.css";

export const Dropdown = ({ className }) => {
  return (
    <div className={className}>
      <div className="text-wrapper">2D Layout - Room</div>

      <img className="vector" alt="Vector" src="./eglass-arrow-down.svg" />
    </div>
  );
};

Dropdown.propTypes = {
  vector: PropTypes.string,
};
