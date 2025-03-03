import React, { useState } from "react";
import { RadioGroup } from "../RadioGroupWrapper/RadioGroup";
import PropTypes from "prop-types";
import "./style.css";

export const ViewSelection = ({
  initialFileName = "myhouse.JSON",
  setMapData,
  onViewChange,
  className = "",
}) => {
  const [fileName, setFileName] = useState(initialFileName);
  const [viewOptions, setViewOptions] = useState([]); // 默认不选中任何选项

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
