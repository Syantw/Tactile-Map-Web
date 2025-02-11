import React, { useRef, useState } from "react";
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
import MapFloor from "../../components/MapFloor/MapFloor";

import "./style.css";

export const MacbookAir = () => {
  const [computerActive, setComputerActive] = useState(false);
  const [drawingMode, setDrawingMode] = useState(null); // 初始模式
  const [selectedModes, setSelectedModes] = useState([]); // 存储选中的 `horizontal` & `vertical`
  const [computeIntersections, setComputeIntersections] = useState(false);
  const [walls, setWalls] = useState([]); // 将墙体数据提升至主页面

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

  return (
    <div className="macbook-air">
      <div className="overlap-wrapper">
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
            />
            <div className="map-container">
              <MapFloor />
            </div>
          </div>

          <div className="div-wrapper">
            <div className="overlap-4">
              <div className="rectangle-3" />

              <div className="annotator">
                <div className="group-6">
                  <div className="overlap-group-2">
                    <div className="text-wrapper-5">Annotator</div>
                  </div>
                </div>

                <div className="frame-3">
                  <div className="frame-4">
                    <div className="frame-wrapper">
                      <div className="frame-5">
                        <div className="frame-6">
                          <RadioGroup
                            property1="select"
                            text="Grid View"
                            vector="https://c.animaapp.com/UTvzRI5U/img/vector-21-5.svg"
                          />
                          <RadioGroup
                            img="/img/vector-21-7.svg"
                            property1="unselect"
                            text="Canvas"
                            vectorClassName="radio-group-instance"
                          />
                        </div>
                      </div>
                    </div>

                    <img
                      className="vector-3"
                      alt="Vector"
                      src="https://c.animaapp.com/UTvzRI5U/img/vector-21-6.svg"
                    />

                    <p className="floorplan-myhouse">
                      <span className="span">FloorPlan - </span>

                      <span className="text-wrapper-6">myhouse.JSON</span>
                    </p>
                  </div>

                  <div className="frame-7">
                    <div className="frame-8">
                      <div className="text-wrapper-7">Trim</div>

                      <TabsAndContent
                        override={
                          <TabItem
                            className="tab-item-2"
                            property1="select-auto"
                          />
                        }
                        property1="auto"
                        tabs={
                          <TabItem
                            className="tab-item-2"
                            property1="unselect-manual"
                          />
                        }
                      />
                      <div className="frame-9">
                        <RadioGroupWrapper
                          className="radio-group-2"
                          radioGroupImg="/img/vector-21-5.svg"
                          radioGroupVector="/img/vector-21-4.svg"
                          radioGroupVectorClassName="radio-group-3"
                          radioGroupVectorClassNameOverride="radio-group-4"
                        />
                        <TrimButton
                          className="trim-button-instance"
                          property1="default"
                          text="Trim"
                        />
                      </div>
                    </div>

                    <img
                      className="vector-3"
                      alt="Vector"
                      src="https://c.animaapp.com/UTvzRI5U/img/vector-21-6.svg"
                    />
                  </div>

                  <div className="frame-4">
                    <Segment_Section
                      setDrawingMode={setDrawingMode}
                      drawingMode={drawingMode}
                      selectedModes={selectedModes}
                      handleModeChange={handleModeChange}
                      handleComputeIntersections={handleComputeIntersections}
                      walls={walls}
                    />
                    <img
                      className="vector-3"
                      alt="Vector"
                      src="https://c.animaapp.com/UTvzRI5U/img/vector-21-6.svg"
                    />
                  </div>

                  <div className="group-11">
                    <p className="entrance-location">
                      Entrance 1 - Location &gt;
                    </p>

                    <p className="p">Entrance 3 - Location &gt;</p>

                    <p className="entrance-location-2">
                      Entrance 2 - Location &gt;
                    </p>

                    <div className="text-wrapper-9">Name</div>

                    <div className="text-wrapper-10">Entrance</div>

                    <div className="text-wrapper-11">Facilities</div>

                    <div className="text-wrapper-12">ID</div>

                    <div className="text-wrapper-13">Label</div>

                    <Dropdown className="dropdown" vector="" />
                    {/* <Dropdown
                    className="dropDown-instance"
                    options={[
                      "2D Layout - Room",
                      "3D Layout - Floor",
                      "Custom Layout",
                    ]}
                    vector={dropdownIcon}
                  /> */}

                    {/* <<img
                    className="frame-15"
                    alt="Frame"
                    src="https://c.animaapp.com/UTvzRI5U/img/frame-6.png"
                  />> */}

                    <div className="lucide-locate-wrapper">
                      <img
                        className="lucide-locate"
                        alt="Lucide locate"
                        src="/img/image.svg"
                      />
                    </div>

                    <div className="group-12">
                      <div className="text-input">
                        <div className="text-wrapper-14">| Description</div>
                      </div>

                      <img
                        className="frame-16"
                        alt="Frame"
                        src="https://c.animaapp.com/UTvzRI5U/img/frame-21-1.png"
                      />
                    </div>

                    <div className="frame-17">
                      <div className="text-wrapper-15">| Name</div>
                    </div>

                    <div className="frame-18">
                      <div className="text-wrapper-15">| Entrance 1</div>
                    </div>

                    <div className="frame-19">
                      <div className="text-wrapper-16">113</div>
                    </div>

                    <img
                      className="group-13"
                      alt="Group"
                      src="https://c.animaapp.com/UTvzRI5U/img/group-1000005133@2x.png"
                    />

                    <img
                      className="lucide-locate-2"
                      alt="Lucide locate"
                      src="/img/lucide-locate.svg"
                    />

                    <div className="frame-20">
                      <div className="text-wrapper-17">Select</div>
                    </div>

                    <div className="frame-21">
                      <div className="text-wrapper-18">Exhibition</div>
                    </div>

                    <div className="frame-22">
                      <div className="text-wrapper-18">Elevator</div>
                    </div>

                    <div className="frame-23">
                      <div className="text-wrapper-18">Service</div>
                    </div>

                    <div className="frame-24">
                      <div className="text-wrapper-18">Restrooms</div>
                    </div>

                    <div className="frame-25">
                      <div className="text-wrapper-18">Landmarks</div>
                    </div>

                    <div className="frame-26">
                      <div className="text-wrapper-19">Obstacles</div>
                    </div>

                    <div className="group-wrapper">
                      <div className="group-14">
                        <div className="group-15">
                          <div className="group-16">
                            <div className="text-wrapper-14">
                              Voice Annotation
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="group-17">
                      <div className="group-18">
                        <div className="group-19">
                          <div className="group-20">
                            <img
                              className="frame-27"
                              alt="Frame"
                              src="https://c.animaapp.com/UTvzRI5U/img/frame-21-1.png"
                            />

                            <div className="frame-28">
                              <div className="text-wrapper-20">Submit</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
