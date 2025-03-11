import React, { useState } from "react";
import { RadioGroup } from "../RadioGroupWrapper/RadioGroup";
import PropTypes from "prop-types";
import "./style.css";

export const ViewSelection = ({
  initialFileName = "...",
  setMapData,
  onViewChange,
  className = "",
}) => {
  const [fileName, setFileName] = useState(initialFileName);
  const [viewOptions, setViewOptions] = useState([]);  

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/json") {
      setFileName(file.name);
      fetch(URL.createObjectURL(file))
        .then((response) => response.json())
        .then((data) => setMapData(data))
        .catch((error) => console.error("Error:", error));
    } else {
      alert("Please upload a valid JSON file.");
    }
  };

  const handleViewChange = (option) => {
    const newOptions = viewOptions.includes(option)
      ? viewOptions.filter((o) => o !== option)
      : [...viewOptions, option];
    setViewOptions(newOptions);
    if (onViewChange) {
      onViewChange(newOptions);
    }
  };

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
          accept=".json"
          style={{ display: "none" }}
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
