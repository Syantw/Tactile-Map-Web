import React, { useState } from "react";
import { Line } from "../Segment/Line";
import { Select } from "../Segment/Select";
import { RadioGroup } from "../RadioGroupWrapper/RadioGroup";
import { ComputerButton } from "../ComputerButton";
import WallList from "../WallList/WallList";

const Segment_Section = ({
  setDrawingMode,
  drawingMode,
  selectedModes,
  handleModeChange,
  handleComputeIntersections,
  walls,
  showGrid, // 新增网格状态
}) => {
  const [activeTab, setActiveTab] = useState(null);

  const handleTabClick = (mode) => {
    const newMode = activeTab === mode ? null : mode;
    setActiveTab(newMode);
    setDrawingMode(newMode);
  };

  return (
    <div className="segmentSelection">
      <div className="h1">Segment</div>

      <div className="segment-controls">
        <Line
          isSelected={activeTab === "line"}
          onClick={() => handleTabClick("line")}
          className="line-instance"
          mingcutePenLine="https://c.animaapp.com/UTvzRI5U/img/mingcute-pen-line-1.svg"
        />
        <Select
          isSelected={activeTab === "select"}
          onClick={() => handleTabClick("select")}
          selectIcon="https://c.animaapp.com/UTvzRI5U/img/ant-design-select-outlined-1.svg"
          className="select-instance"
        />
      </div>

      {activeTab === "line" && (
        <div className="frame-11">
          <RadioGroup
            text="Horizontal"
            vector="https://c.animaapp.com/UTvzRI5U/img/vector-21-5.svg"
            selectedOptions={selectedModes}
            onChange={handleModeChange}
          />
          <RadioGroup
            text="Vertical"
            vector="https://c.animaapp.com/UTvzRI5U/img/vector-21-5.svg"
            selectedOptions={selectedModes}
            onChange={handleModeChange}
          />
        </div>
      )}

      <ComputerButton
        className="computer-button-instance"
        onClick={handleComputeIntersections}
        Type="Compute"
      />
      <WallList walls={walls} />

      <img
        className="vector-3"
        alt="Vector"
        src="https://c.animaapp.com/UTvzRI5U/img/vector-21-6.svg"
      />
    </div>
  );
};

export default Segment_Section;
