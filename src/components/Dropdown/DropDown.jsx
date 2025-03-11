import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import "./style.css";

export const Dropdown = ({
  className,
  options: initialOptions = [
    "2D Layout - Room",
    "2D Layout - Office",
    "2D Layout - Entrance",
    "2D Layout - Stair",
    "2D Layout - Elevator",
    "2D Layout - Garden",
    "2D Layout - Restroom",
  ],
  defaultValue = "2D Layout - Room",
  setShowCustomInput,
  setCustomLabel,
  selectedCategory,
  setSelectedCategory,
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
    if (option === "Add More") {
      setSelectedValue("Add More");
      setShowCustomInput(true);
      setIsOpen(false);
      setCustomLabel("");
    } else {
      if (!selectedCategory.includes(option)) {
        setSelectedCategory((prev) => [...prev, option]);
      }
      setSelectedValue(option);
      setIsOpen(false);
      setShowCustomInput(false);
    }
    console.log("Option selected:", option);
  };

  // Update selectedValue when custom label is confirmed (handled by parent)
  useEffect(() => {
    if (setCustomLabel && typeof setCustomLabel === "function") {
      setCustomLabel((newLabel) => {
        if (newLabel && !selectedCategory.includes(newLabel)) {
          setSelectedCategory((prev) => [...prev, newLabel]);
          setSelectedValue(newLabel);
        }
      });
    }
  }, [setCustomLabel, selectedCategory]);

  return (
    <div className={`dropdown ${className}`}>
      <div className="dropdown-header" onClick={toggleDropdown}>
        <div className="text-wrapper">{selectedValue}</div>
        <img className="vector" alt="Vector" src="./eglass-arrow-down.svg" />
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          {initialOptions.map((option) => (
            <div
              key={option}
              className={`dropdown-item ${
                selectedValue === option ? "selected" : ""
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
  setShowCustomInput: PropTypes.func,
  setCustomLabel: PropTypes.func,
  selectedCategory: PropTypes.array,
  setSelectedCategory: PropTypes.func,
};
