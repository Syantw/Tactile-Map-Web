import React, { useState } from "react";
import { RadioGroup } from "../RadioGroupWrapper/RadioGroup";
import PropTypes from "prop-types";
import "./style.css";

// Component for selecting view options and loading floor plan files
export const ViewSelection = ({
  initialFileName = "myhouse.JSON",
  setMapData,
  onViewChange,
  className = "",
}) => {
  const [fileName, setFileName] = useState(initialFileName); // Tracks the loaded file name
  const [viewOptions, setViewOptions] = useState([]); // Holds selected view options, starts empty

  // Load and parse a new JSON file when selected
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      fetch(URL.createObjectURL(file))
        .then((response) => response.json())
        .then((data) => setMapData(data))
        .catch((error) => console.error("加载新文件失败:", error));
    }
  };

  // Toggle view options and notify parent
  const handleViewChange = (option) => {
    const newOptions = viewOptions.includes(option)
      ? viewOptions.filter((o) => o !== option)
      : [...viewOptions, option];
    setViewOptions(newOptions);
    if (onViewChange) {
      onViewChange(newOptions);
    }
    console.log("View options updated in ViewSelection:", newOptions);
  };

  // Render the view selection UI
  return (
    <div className={`viewSelection ${className}`}>
      <p className="h1">
        <span>FloorPlan - </span>
        <label htmlFor="file-select" className="text-wrapper-6">
          {fileName}
        </label>
        <input
          id="file-select"
          type="file"
          style={{ display: "none" }} // Hidden input for file selection
          onChange={handleFileSelect}
        />
      </p>
      <div className="viewRadio">
        <RadioGroup
          text="Grid View"
          vector="https://c.animaapp.com/UTvzRI5U/img/vector-21-5.svg"
          selectedOptions={viewOptions}
          onChange={handleViewChange}
        />
        <RadioGroup
          text="Wall"
          vector="https://c.animaapp.com/UTvzRI5U/img/vector-21-5.svg"
          selectedOptions={viewOptions}
          onChange={handleViewChange}
        />
      </div>
      <img
        className="vector-3"
        alt="Vector"
        src="https://c.animaapp.com/UTvzRI5U/img/vector-21-6.svg"
      />
    </div>
  );
};

ViewSelection.propTypes = {
  initialFileName: PropTypes.string,
  setMapData: PropTypes.func.isRequired,
  onViewChange: PropTypes.func,
  className: PropTypes.string,
};
