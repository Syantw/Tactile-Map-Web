import PropTypes from "prop-types";
import React, { useState } from "react";
import "./style.css";

export const Dropdown = ({
  className,
  options = ["2D Layout - Room", "3D View", "Map Overview"],
  defaultValue = "2D Layout - Room",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  const toggleDropdown = () => {
    setIsOpen((prev) => {
      console.log("Toggling dropdown, isOpen:", !prev);
      return !prev;
    });
  };

  const handleOptionClick = (option) => {
    setSelectedValue(option);
    setIsOpen(false);
    console.log("Option selected:", option);
  };

  return (
    <div className={`dropdown ${className}`}>
      <div className="dropdown-header" onClick={toggleDropdown}>
        <div className="text-wrapper">{selectedValue}</div>
        <img className="vector" alt="Vector" src="./eglass-arrow-down.svg" />
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          {options.map((option) => (
            <div
              key={option}
              className={`dropdown-item ${
                option === selectedValue ? "selected" : ""
              }`}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

Dropdown.propTypes = {
  className: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.string),
  defaultValue: PropTypes.string,
};
