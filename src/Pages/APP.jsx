// MacbookAir.jsx (minimal changes)
import React, { useRef, useState, useEffect } from "react";
import { MenubarAndContent } from "../components/Menubar_1/MenubarAndContent";
import { Switch } from "../components/Switch";
import DrawingCanvas from "../components/DrawingCanvas/DrawingCanvas";
import Segment_Section from "../components/Segement_Section/Segment_Section";
import CustomButton from "../components/CustomizedButton/CustomizedButton";
import FloorMap from "../components/FloorMap/FloorMap";
import TrimSelection from "../components/Trim/Trim";
import { ViewSelection } from "../components/ViewSelection/ViewSelection";
import { LabelSelection } from "../components/LabelSelection/LabelSelection";
import "./style.css";

export const APP = () => {
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
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [refineMode, setRefineMode] = useState(false);
  const [customLabels, setCustomLabels] = useState([]);
  const [facilityLabels, setFacilityLabels] = useState([
    "Exhibition",
    "Elevator",
    "Service",
    "Restrooms",
    "Landmarks",
    "Obstacles",
  ]); // New state for facility labels

  useEffect(() => {
    const savedLabels = localStorage.getItem("customLabels");
    if (savedLabels) {
      setCustomLabels(JSON.parse(savedLabels));
    }

    fetch("/space_scan.json")
      .then((response) => {
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        console.log("Loaded JSON data:", data);
        setMapData(data);
      })
      .catch((error) => console.error("Failed to load JSON:", error));
  }, []);

  useEffect(() => {
    localStorage.setItem("customLabels", JSON.stringify(customLabels));
  }, [customLabels]);

  useEffect(() => {
    console.log("isPicking updated:", isPicking);
  }, [isPicking]);

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
    setRooms((prev) => [
      ...prev,
      { points, metadata: { name: "", id: "", category: [] } },
    ]);
    console.log("Room formed in MacbookAir:", { points });
  };

  const handleBackToSegment = () => {
    setRefineMode(false);
    setSelectedRoom(null);
    console.log("Back to segment mode");
  };

  const addCustomLabel = (label) => {
    if (!customLabels.includes(label)) {
      setCustomLabels((prev) => [...prev, label]);
      console.log("Added custom label:", label);
    }
  };

  const addFacilityLabel = (label) => {
    if (label && !facilityLabels.includes(label)) {
      setFacilityLabels((prev) => [...prev, label]);
    }
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
                  selectedRoom={selectedRoom}
                  setSelectedRoom={setSelectedRoom}
                  refineMode={refineMode}
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
              {!refineMode ? (
                <>
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
                    rooms={rooms}
                    selectedRoom={selectedRoom}
                    setSelectedRoom={setSelectedRoom}
                    setRefineMode={setRefineMode}
                  />

                  <img
                    className="vector-3"
                    alt="Vector"
                    src="https://c.animaapp.com/UTvzRI5U/img/vector-21-6.svg"
                  />

                  <CustomButton
                    onClick={() => alert("submit")}
                    className="export-button"
                    style={{
                      width: "90%",
                      marginTop: "20px",
                      backgroundColor: "#396DA0",
                      transition:
                        "background 0.3s ease-in-out, transform 0.1s ease",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "#24588C";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = "#396DA0";
                    }}
                  >
                    Export
                  </CustomButton>
                </>
              ) : (
                <>
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
                    selectedRoom={selectedRoom}
                    setRooms={setRooms}
                    rooms={rooms}
                    customLabels={customLabels}
                    addCustomLabel={addCustomLabel}
                    facilityLabels={facilityLabels} // Pass facility labels
                    addFacilityLabel={addFacilityLabel} // Pass function to add new facility labels
                  />

                  <CustomButton
                    onClick={handleBackToSegment}
                    style={{ width: "85%", marginTop: "10px" }}
                  >
                    Finish
                  </CustomButton>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APP;
