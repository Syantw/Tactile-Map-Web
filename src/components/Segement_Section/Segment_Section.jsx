import React from "react";
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
}) => {
  return (
    <div className="segmentSelection">
      <div className="h1">Segment</div>

      {/* Segment Controls */}
      <div className="segment-controls">
        <Line
          setDrawingMode={setDrawingMode}
          drawingMode={drawingMode}
          className="line-instance"
          mingcutePenLine="https://c.animaapp.com/UTvzRI5U/img/mingcute-pen-line-1.svg"
        />
        <Select
          setDrawingMode={setDrawingMode}
          drawingMode={drawingMode}
          selectIcon="https://c.animaapp.com/UTvzRI5U/img/ant-design-select-outlined-1.svg"
          className="select-instance"
        />
      </div>

      {/* Radio Buttons for Line Selection */}
      <div className="frame-11">
        <RadioGroup
          text="Horizontal"
          vector="https://c.animaapp.com/UTvzRI5U/img/vector-21-5.svg"
          selectedOptions={selectedModes}
          onChange={handleModeChange}
          isControlled={drawingMode === "line"}
        />
        <RadioGroup
          text="Vertical"
          vector="https://c.animaapp.com/UTvzRI5U/img/vector-21-5.svg"
          selectedOptions={selectedModes}
          onChange={handleModeChange}
          isControlled={drawingMode === "line"}
        />
      </div>

      {/* Compute and Generate Buttons */}
      <ComputerButton
        className="computer-button-instance"
        onClick={handleComputeIntersections}
        Type="Compute"
      />
      <WallList walls={walls} />
      <ComputerButton
        className="generate-button-instance"
        onClick={handleComputeIntersections}
        Type="Generate"
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
