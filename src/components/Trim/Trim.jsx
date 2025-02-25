import React, { useState } from "react";
import { TabsAndContent } from "../TabsAndContent";
import { RadioGroupWrapper } from "../RadioGroupWrapper";
import { TrimButton } from "../TrimButton";
import simplify from "simplify-js";
import hull from "hull.js";
import "./styles.css";

const TrimSelection = ({ onTrim, mapData, setMapData }) => {
  const [trimMode, setTrimMode] = useState("auto");
  const [manualTool, setManualTool] = useState(null);

  const handleAutoTrim = () => {
    const trimmedData = { ...mapData };
    trimmedData.layers = trimmedData.layers.map((layer) => {
      if (layer.type !== "floor") return layer;

      // 提取所有点
      const points = [];
      for (let i = 0; i < layer.pixels.length; i += 2) {
        points.push({ x: layer.pixels[i], y: layer.pixels[i + 1] });
      }

      // 使用 hull 获取外轮廓
      const hullPoints = hull(
        points.map((p) => [p.x, p.y]),
        50
      );
      const simplifiedHull = simplify(
        hullPoints.map(([x, y]) => ({ x, y })),
        5,
        true
      );
      const newPixels = simplifiedHull.flatMap((p) => [p.x, p.y]);

      console.log(
        "Auto trim: Original points:",
        points.length,
        "Hull points:",
        newPixels.length
      );
      return { ...layer, pixels: newPixels };
    });
    setMapData(trimmedData);
  };

  const handleToolSelect = (tool) => {
    setManualTool(manualTool === tool ? null : tool);
    onTrim("manual", manualTool === tool ? null : tool);
  };

  return (
    <div className="trimSelection">
      <div className="h1">Trim</div>
      <TabsAndContent
        property1={trimMode}
        onTabChange={(index) => setTrimMode(index === 0 ? "auto" : "manual")}
      />

      <div
        className="trimMethod"
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "15px",
          justifyContent: "space-around",
          width: "90%",
          marginTop: "20px",
        }}
      >
        {trimMode === "manual" && (
          <RadioGroupWrapper
            className="radio-group-2"
            radioGroupImg="/img/vector-21-5.svg"
            radioGroupVector="/img/vector-21-4.svg"
            radioGroupVectorClassName="radio-group-3"
            radioGroupVectorClassNameOverride="radio-group-4"
            onToolSelect={handleToolSelect}
            selectedTool={manualTool}
          />
        )}
        <TrimButton
          className="trim-button-instance"
          property1="default"
          text="Trim"
          onClick={
            trimMode === "auto"
              ? handleAutoTrim
              : () => onTrim("manual", manualTool)
          }
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

export default TrimSelection;
