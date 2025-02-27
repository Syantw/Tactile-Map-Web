import React, { useRef, useState, useEffect } from "react";
import { ComputerButton } from "../../components/ComputerButton";
import { Indicators } from "../../components/Indicators";
import { Line } from "../../components/Segment/Line";
import { MenubarAndContent } from "../../components/Menubar_1/MenubarAndContent";
import { RadioGroup } from "../../components/RadioGroupWrapper/RadioGroup";
import { RadioGroupWrapper } from "../../components/RadioGroupWrapper";
import { Rec } from "../../components/Segment/Rec";
import { Select } from "../../components/Segment/Select";
import { Switch } from "../../components/Switch";
import { TabItem } from "../../components/TabItem";
import { TabsAndContent } from "../../components/TabsAndContent";
import { TrimButton } from "../../components/TrimButton";
import { Dropdown } from "../../components/Dropdown/DropDown";
import DrawingCanvas from "../../components/DrawingCanvas/DrawingCanvas"; // 引入绘图组件
import WallList from "../../components/WallList/WallList";
import Segment_Section from "../../components/Segement_Section/Segment_Section";
import MapFloor from "../../components/MapFloor(ineffective)/MapFloor";
import { Button } from "react-bootstrap";
import CustomButton from "../../components/CustomizedButton/CustomizedButton";
import SelectableButtons from "../../components/SelectableButtons/SelectableButtons";
import LocationPicker from "../../components/LocationPicker/LocationPicker";
import { Form } from "react-bootstrap";
import FloorMap from "../../components/FloorMap/FloorMap";
import TrimSelection from "../../components/Trim/Trim";
import { InputField } from "../../components/FieldInput/FieldInput";
import { FileUpload } from "../../components/FileUpload/FileUpload";
import { ViewSelection } from "../../components/ViewSelection/ViewSelection";
import { RadioGroupTrim } from "../../components/RadioGroupWrapper/RadioGroupTrim/RadioGroupTrim";
import "./style.css";

export const MacbookAir = () => {
  const [computerActive, setComputerActive] = useState(false);
  const [drawingMode, setDrawingMode] = useState(null); // 初始模式
  const [selectedModes, setSelectedModes] = useState([]); // 存储选中的 `horizontal` & `vertical`
  const [computeIntersections, setComputeIntersections] = useState(false);
  const [walls, setWalls] = useState([]); // 将墙体数据提升至主页面
  const [locations, setLocations] = useState([]);
  const [mapData, setMapData] = useState(null); // 添加状态用于存储 JSON 数据
  const [trimMode, setTrimMode] = useState(null); // 独立的 trimMode
  const [name, setName] = useState(""); // Name 输入框状态
  const [id, setId] = useState(""); // ID 输入框状态
  const [entrance, setEntrance] = useState("");
  const [viewOptions, setViewOptions] = useState(["Grid View"]); // 移到主组件

  // 加载 JSON 数据
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

  // 控制 `horizontal` & `vertical` 的复选
  const handleModeChange = (mode) => {
    if (drawingMode !== "line") return; // 只有 `line` 模式下才允许复选
    setSelectedModes((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]
    );
  };

  const handleComputeIntersections = () => {
    setComputeIntersections(false); // 触发交点计算
    setTimeout(() => setComputeIntersections(true), 100); // 触发更新
  };

  const handleLocationSelect = (newLocation) => {
    setLocations((prev) => [...prev, newLocation]);
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

  return (
    <div className="macbook-air">
      <div className="overlap">
        <div className="frame">
          {/* UI Elements Over the Map */}
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
          <DrawingCanvas
            drawingMode={drawingMode}
            selectedModes={selectedModes}
            computeIntersections={computeIntersections}
            setComputeIntersections={setComputeIntersections}
            setWalls={setWalls}
            showGrid={viewOptions.includes("Grid View")}
          />

          <div className="map-container">
            {mapData ? (
              <FloorMap
                mapData={mapData}
                trimMode={trimMode}
                setMapData={setMapData}
                showGrid={viewOptions.includes("Grid View")}
                showWall={!viewOptions.includes("Wall")} // Display wall when selected
              />
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
                showGrid={viewOptions.includes("Grid View")} // 传递网格状态
              />

              <div className="labelSelection">
                <div className="h1">Label</div>
                {/* <Dropdown className="dropdown" vector="" /> */}
                <Dropdown
                  className="dropdown"
                  options={["2D Layout - Room", "3D View", "Map Overview"]}
                  defaultValue="2D Layout - Room"
                />
                <div className="entrance">
                  <div className="text-wrapper-10">Entrance</div>
                  <div className="entrance_selector">
                    <InputField
                      // label=""
                      value={entrance}
                      onChange={setEntrance}
                      placeholder="Pick Entrance"
                      type="text"
                      disabled={false}
                    />

                    <div className="entrance_list">
                      <p className="entrance-location">
                        Entrance 1 - Location &gt;
                      </p>

                      <p className="entrance-location">
                        Entrance 3 - Location &gt;
                      </p>

                      <p className="entrance-location">
                        Entrance 2 - Location &gt;
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className="info"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "90%",
                  }}
                >
                  <InputField
                    label="Name"
                    value={name}
                    onChange={setName}
                    placeholder="Enter name"
                    type="text"
                    disabled={false}
                  />
                  <InputField
                    label="ID"
                    value={id}
                    onChange={setId}
                    placeholder="Enter ID"
                    type="text"
                    disabled={false}
                  />
                </div>
                <div className="facilities">
                  <div className="text-wrapper-10">Facilities</div>

                  <div className="facilitySelection">
                    <Form.Group
                      className="mb-1"
                      controlId="exampleForm.ControlTextarea1"
                      style={{ width: "60%" }}
                    >
                      <Form.Control as="textarea" rows={1} />
                    </Form.Group>
                    {/* <div className="text-input">
                          <div className="text-wrapper-14">| Description</div>
                        </div> */}

                    <CustomButton
                      style={{
                        width: "30%",
                        height: "29px",
                        fontSize: "12px",
                      }}
                    >
                      Select
                    </CustomButton>
                  </div>

                  <div className="facilities-list">
                    <SelectableButtons
                      labels={[
                        "Exhibition",
                        "Elevator",
                        "Service",
                        "Restrooms",
                        "Landmarks",
                        "Obstacles",
                      ]}
                      // buttonStyle={{  }}
                    ></SelectableButtons>
                  </div>
                </div>

                <div className="description">
                  <div className="text-wrapper-10">Description</div>

                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Form.Control as="textarea" rows={5} />
                  </Form.Group>
                  {/* <div className="text-input">
                          <div className="text-wrapper-14">| Description</div>
                        </div> */}
                </div>

                <div className="voiceAnnotation">
                  <FileUpload
                    label="Voice Annotation"
                    onFileUpload={handleFileUpload}
                  />

                  <CustomButton onClick={() => alert("submit")}>
                    Submit
                  </CustomButton>

                  <img
                    className="frame-27"
                    alt="Frame"
                    src="https://c.animaapp.com/UTvzRI5U/img/frame-21-1.png"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
