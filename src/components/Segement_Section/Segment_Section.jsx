import React, { useState } from "react";
import { Line } from "../Segment/Line";
import { Select } from "../Segment/Select";
import { RadioGroup } from "../RadioGroupWrapper/RadioGroup";
import { ComputerButton } from "../ComputerButton";
import WallList from "../WallList/WallList";
import CustomButton from "../CustomizedButton/CustomizedButton";

// 新增 Rectangle 组件
const Rectangle = ({ className, mingcutePenLine, isSelected, onClick }) => {
  return (
    <div
      className={`line ${className} ${isSelected ? "default" : "unselect"}`}
      onClick={onClick}
    >
      <img
        className="mingcute-pen-line"
        alt="Mingcute pen line"
        src={mingcutePenLine}
      />
      <div className="text-wrapper">Rectangle</div>
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
  detectRooms,
}) => {
  const [activeTab, setActiveTab] = useState(null);

  const handleTabClick = (mode) => {
    const newMode = activeTab === mode ? null : mode;
    setActiveTab(newMode);
    setDrawingMode(newMode);
    setIsPicking(false);
    console.log(`Drawing mode set to: ${newMode}, isPicking: false`);
  };

  const handleFormRoom = () => {
    const selectedPoints = walls
      .filter((wall) => selectedWalls.includes(wall.id))
      .map((wall) => wall.position);

    if (selectedPoints.length < 3) {
      console.warn("At least 3 points are required to form a room.");
      return;
    }

    const points = selectedPoints.map((point) => ({
      x: point.x,
      y: point.y,
    }));

    detectRooms(points);

    setDrawingMode("select");
    setActiveTab("select");
    console.log("Formed room with points:", points);
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

      {/* 只有在 drawingMode 为 line 时显示 WallList 和 Form Room 按钮 */}
      {drawingMode === "line" && (
        <>
          <WallList
            walls={walls}
            selectedWalls={selectedWalls}
            setSelectedWalls={setSelectedWalls}
          />
          <CustomButton
            style={{
              width: "100%",
              height: "29px",
              fontSize: "12px",
              marginTop: "10px",
            }}
            onClick={handleFormRoom}
          >
            Form Room
          </CustomButton>
        </>
      )}

      <img
        className="vector-3"
        alt="Vector"
        src="https://c.animaapp.com/UTvzRI5U/img/vector-21-6.svg"
      />
    </div>
  );
};

export default Segment_Section;
