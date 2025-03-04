import React, { useState } from "react";
import { Line } from "../Segment/Line";
import { Select } from "../Segment/Select";
import { RadioGroup } from "../RadioGroupWrapper/RadioGroup";
import { ComputerButton } from "../ComputerButton";
import WallList from "../WallList/WallList";

// 新增 Rectangle 组件
const Rectangle = ({ className, mingcutePenLine, isSelected, onClick }) => {
  return (
    <div
      className={`line ${className} ${isSelected ? "default" : "unselect"}`}
      onClick={onClick}
    >
      <svg
        className="mingcute-pen-line"
        viewBox="0 0 1024 1024"
        width="200"
        height="200"
        fill="white"
      >
        <path d="M841.34 959.36H182.66c-65.06 0-117.99-52.94-117.99-118.02V182.69c0-65.08 52.94-118.04 117.99-118.04h658.68c65.06 0 117.99 52.96 117.99 118.04v658.65c0 65.08-52.93 118.02-117.99 118.02zM182.66 142.17c-22.31 0-40.51 18.18-40.51 40.51v658.65c0 22.34 18.2 40.49 40.51 40.49h658.68c22.31 0 40.51-18.15 40.51-40.49V182.69c0-22.34-18.2-40.51-40.51-40.51H182.66z" />
      </svg>
      <div className="text-wrapper">Rec</div>
    </div>
  );
};

const Segment_Section = ({
  setDrawingMode,
  drawingMode,
  selectedModes,
  handleModeChange,
  handleComputeIntersections,
  walls,
  showGrid,
  setIsPicking,
  selectedWalls,
  setSelectedWalls,
}) => {
  const [activeTab, setActiveTab] = useState(null);

  const handleTabClick = (mode) => {
    const newMode = activeTab === mode ? null : mode;
    setActiveTab(newMode);
    setDrawingMode(newMode);
    setIsPicking(false); // 确保切换模式时关闭点位标记模式
    console.log(`Drawing mode set to: ${newMode}, isPicking: false`);
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
        <Rectangle
          isSelected={activeTab === "rectangle"}
          onClick={() => handleTabClick("rectangle")}
          className="rec-instance"
          mingcutePenLine="https://c.animaapp.com/UTvzRI5U/img/mingcute-pen-line-1.svg"
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
      <WallList
        walls={walls}
        selectedWalls={selectedWalls}
        setSelectedWalls={setSelectedWalls}
      />

      <img
        className="vector-3"
        alt="Vector"
        src="https://c.animaapp.com/UTvzRI5U/img/vector-21-6.svg"
      />
    </div>
  );
};

export default Segment_Section;
