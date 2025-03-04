import React, { useRef, useState, useEffect } from "react";
import { Indicators } from "../../components/Indicators";
import { MenubarAndContent } from "../../components/Menubar_1/MenubarAndContent";
import { Switch } from "../../components/Switch";
import DrawingCanvas from "../../components/DrawingCanvas/DrawingCanvas";
import Segment_Section from "../../components/Segement_Section/Segment_Section";
import CustomButton from "../../components/CustomizedButton/CustomizedButton";
import FloorMap from "../../components/FloorMap/FloorMap";
import TrimSelection from "../../components/Trim/Trim";
import { ViewSelection } from "../../components/ViewSelection/ViewSelection";
import { LabelSelection } from "../../components/LabelSelection/LabelSelection";
import { Form, Button } from "react-bootstrap";
import "./style.css";

export const MacbookAir = () => {
  const [computerActive, setComputerActive] = useState(false);
  const [drawingMode, setDrawingMode] = useState(null);
  const [selectedModes, setSelectedModes] = useState([]);
  const [computeIntersections, setComputeIntersections] = useState(false);
  const [walls, setWalls] = useState([]);
  const [selectedWalls, setSelectedWalls] = useState([]);
  const [locations, setLocations] = useState([]);
  const [tempLocation, setTempLocation] = useState(null);
  const [mapData, setMapData] = useState(null);
  const [trimMode, setTrimMode] = useState(null);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [entrance, setEntrance] = useState("");
  const [viewOptions, setViewOptions] = useState([]);
  const [highlightedLocation, setHighlightedLocation] = useState(null);
  const [isPicking, setIsPicking] = useState(false);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetch("/space_scan.json")
      .then((response) => {
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        console.log("加载的 JSON 数据:", data);
        setMapData(data);
      })
      .catch((error) => console.error("加载 JSON 失败:", error));
  }, []);

  const handleModeChange = (mode) => {
    if (drawingMode !== "line") return;
    setSelectedModes((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]
    );
  };

  const handleComputeIntersections = () => {
    setComputeIntersections(false);
    setTimeout(() => setComputeIntersections(true), 100);
  };

  const handleAddLocation = (location) => {
    setTempLocation(location);
    console.log("Temp location set in MacbookAir:", location);
  };

  const handleTrim = (mode, tool) => {
    setTrimMode(mode === "manual" ? tool : null);
    console.log("Trim mode set to:", mode, "Tool:", tool);
  };

  const handleViewChange = (newOptions) => {
    setViewOptions(newOptions);
    console.log("View options updated in MacbookAir:", newOptions);
  };

  const handleFileUpload = (file) => {
    console.log("Uploaded file:", file);
  };

  const detectRooms = (points) => {
    if (points.length < 3) {
      console.warn("At least 3 points are required to form a room.");
      return;
    }
    setRooms((prev) => [...prev, { points, metadata: { name: "", id: "" } }]);
    console.log("Room formed in MacbookAir:", { points });
  };

  return (
    <div className="macbook-air">
      <div className="overlap">
        <div className="frame">
          <div className="ui-overlay">
            <div className="screenUI">
              <MenubarAndContent className="menubar-and-content-instance" />
              <Switch className="switch-instance" state="off" text="3D" />
            </div>
            <div className="rectangle-2" />
            <div className="group-2">
              <Indicators
                className="indicators-instance"
                ellipseClassName="indicators-4"
                ellipseClassNameOverride="indicators-5"
                groupClassName="indicators-2"
                overlapGroupClassName="indicators-3"
                property1="end"
              />
            </div>

            <div className="group-3" />

            <div className="group-4" />

            <div className="overlap-group-wrapper">
              <div className="overlap-3">
                <div className="float-destinations">
                  <div className="group-5" />

                  <div className="frame-2">
                    <div className="starting-point">Room</div>

                    <div className="stark-tower">113</div>
                  </div>
                </div>

                <img
                  className="vector-2"
                  alt="Vector"
                  src="https://c.animaapp.com/UTvzRI5U/img/vector.svg"
                />
              </div>
            </div>
          </div>

          <div className="map-container">
            {mapData ? (
              <>
                <FloorMap
                  mapData={mapData}
                  trimMode={trimMode}
                  setMapData={setMapData}
                  showGrid={viewOptions.includes("Grid View")}
                  showWall={viewOptions.includes("Wall")}
                  locations={locations}
                  highlightedLocation={highlightedLocation}
                  setHighlightedLocation={setHighlightedLocation}
                  isPicking={isPicking}
                  handleAddLocation={handleAddLocation}
                />
                <DrawingCanvas
                  drawingMode={drawingMode}
                  setDrawingMode={setDrawingMode}
                  selectedModes={selectedModes}
                  computeIntersections={computeIntersections}
                  setComputeIntersections={setComputeIntersections}
                  setWalls={setWalls}
                  showGrid={viewOptions.includes("Grid View")}
                  isPicking={isPicking}
                  selectedWalls={selectedWalls}
                  setSelectedWalls={setSelectedWalls}
                  detectRooms={detectRooms}
                  setRooms={setRooms}
                  rooms={rooms}
                />
              </>
            ) : (
              <div>Loading map...</div>
            )}
          </div>
        </div>

        <div className="div-wrapper">
          <div className="rectangle-3" />

          <div className="annotator">
            <div className="text-wrapper-5">Annotator</div>

            <div className="annotator_content">
              <ViewSelection
                initialFileName="myhouse.JSON"
                setMapData={setMapData}
                onViewChange={handleViewChange}
              />

              <TrimSelection
                onTrim={handleTrim}
                mapData={mapData}
                setMapData={setMapData}
              />

              <Segment_Section
                setDrawingMode={setDrawingMode}
                drawingMode={drawingMode}
                selectedModes={selectedModes}
                handleModeChange={handleModeChange}
                handleComputeIntersections={handleComputeIntersections}
                walls={walls}
                showGrid={viewOptions.includes("Grid View")}
                setIsPicking={setIsPicking}
                selectedWalls={selectedWalls}
                setSelectedWalls={setSelectedWalls}
                detectRooms={detectRooms}
              />
              <LabelSelection
                name={name}
                setName={setName}
                id={id}
                setId={setId}
                entrance={entrance}
                setEntrance={setEntrance}
                locations={locations}
                setLocations={setLocations}
                tempLocation={tempLocation}
                setTempLocation={setTempLocation}
                onFileUpload={handleFileUpload}
                setIsPicking={setIsPicking}
              />

              <CustomButton
                onClick={() => alert("submit")}
                style={{ width: "85%" }}
              >
                Submit
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MacbookAir;
