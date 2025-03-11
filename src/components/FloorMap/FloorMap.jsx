import React, { Fragment, useState, useEffect, useRef } from "react";
import { Stage, Layer, Line, Rect, Text } from "react-konva";
import simplify from "simplify-js";

const FloorMap = ({
  mapData,
  trimMode,
  setMapData,
  showGrid = true,
  showWall = true,
  locations = [],
  highlightedLocation,
  setHighlightedLocation,
  isPicking,
  handleAddLocation,
}) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 800 });
  const [zoom, setZoom] = useState(1);
  const [drawingPoints, setDrawingPoints] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeInfoBox, setActiveInfoBox] = useState(null);
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        if (offsetWidth > 0 && offsetHeight > 0) {
          setDimensions({ width: offsetWidth, height: offsetHeight });
          console.log("Dimensions updated:", {
            width: offsetWidth,
            height: offsetHeight,
          });
        }
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    console.log(
      "FloorMap props updated - locations:",
      locations,
      "activeInfoBox:",
      activeInfoBox,
      "isPicking:",
      isPicking,
      "showGrid:",
      showGrid,
      "showWall:"
    );
  }, [locations, activeInfoBox, isPicking, showGrid, showWall]);

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    setZoom((prev) =>
      Math.min(
        Math.max(0.5, e.evt.deltaY > 0 ? prev / scaleBy : prev * scaleBy),
        3
      )
    );
  };

  const handleDragEnd = (e) => {
    const stage = e.target;
    setStagePosition({ x: stage.x(), y: stage.y() });
  };

  const handleMouseDown = (e) => {
    if (!["pencil", "pen"].includes(trimMode)) return;
    try {
      const stage = e.target.getStage();
      const pos = stage.getPointerPosition();
      const snappedPos = snapToGrid(pos, showGrid);
      setDrawingPoints([snappedPos.x, snappedPos.y]);
      setIsDrawing(true);
      console.log("Mouse down, start drawing at:", snappedPos.x, snappedPos.y);
    } catch (error) {
      console.error("Error in handleMouseDown:", error);
    }
  };

  const handleMouseMove = (e) => {
    if (!["pencil", "pen"].includes(trimMode) || !isDrawing) return;
    try {
      const stage = e.target.getStage();
      const pos = stage.getPointerPosition();
      const snappedPos = snapToGrid(pos, showGrid);
      setDrawingPoints((prev) => {
        const newPoints = [...prev.slice(0, -2), snappedPos.x, snappedPos.y];
        console.log("Mouse move, drawing points:", newPoints);
        return newPoints;
      });
    } catch (error) {
      console.error("Error in handleMouseMove:", error);
    }
  };

  const handleMouseUp = (e) => {
    if (!["pencil", "pen"].includes(trimMode) || drawingPoints.length < 4)
      return;
    setIsDrawing(false);
    try {
      const newData = { ...mapData };
      const floorLayer = newData.layers.find((l) => l.type === "floor");
      if (!floorLayer) return;

      const { scale, minX, minY, dataWidth, dataHeight } = getGlobalBounds(
        mapData.layers
      );
      const simplifiedLine = simplify(
        drawingPoints.reduce((acc, val, i) => {
          if (i % 2 === 0) {
            const x =
              (val - (canvasWidth - dataWidth) / 2) / (pixelSize * scale) +
              minX;
            const y =
              (drawingPoints[i + 1] - (canvasHeight - dataHeight) / 2) /
                (pixelSize * scale) +
              minY;
            acc.push({ x, y });
          }
          return acc;
        }, []),
        1,
        true
      ).flatMap((p) => [p.x, p.y]);
      console.log("Mouse up, simplified line:", simplifiedLine);

      const newPixels1 = [],
        newPixels2 = [];
      for (let i = 0; i < floorLayer.pixels.length; i += 2) {
        const x = floorLayer.pixels[i];
        const y = floorLayer.pixels[i + 1];
        const side =
          (simplifiedLine[2] - simplifiedLine[0]) * (y - simplifiedLine[1]) -
          (simplifiedLine[3] - simplifiedLine[1]) * (x - simplifiedLine[0]);
        if (side > 0) newPixels1.push(x, y);
        else newPixels2.push(x, y);
      }

      if (newPixels1.length > 0 && newPixels2.length > 0) {
        floorLayer.pixels = [...newPixels1, ...newPixels2];
        setMapData(newData);
        setDrawingPoints(simplifiedLine);
        console.log("Floor split:", newPixels1.length, newPixels2.length);
      } else {
        console.warn("Invalid split, no change applied");
        setDrawingPoints([]);
      }
    } catch (error) {
      console.error("Error in handleMouseUp:", error);
      setDrawingPoints([]);
    }
  };

  const handleClick = (e) => {
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    const snappedPos = snapToGrid(pos, showGrid);

    // 调整点击坐标以考虑 Stage 的拖动和缩放
    const adjustedX = (snappedPos.x - stagePosition.x) / zoom;
    const adjustedY = (snappedPos.y - stagePosition.y) / zoom;

    console.log("Adjusted click position:", { adjustedX, adjustedY });
    console.log("Current locations:", locations);

    // 标记阶段：isPicking 为 true 时，点击任意位置添加点位
    if (isPicking && !trimMode) {
      handleAddLocation({ x: adjustedX, y: adjustedY });
      console.log("Picking location:", { x: adjustedX, y: adjustedY });
      return;
    }

    // 查看阶段：isPicking 为 false 时，检测是否点击已有点位
    if (!isPicking) {
      const clickedLocation = locations.find((loc) => {
        const locX = loc.x;
        const locY = loc.y;
        const distance = Math.sqrt(
          Math.pow(locX - adjustedX, 2) + Math.pow(locY - adjustedY, 2)
        );
        console.log(
          "Checking location:",
          loc,
          "Distance:",
          distance,
          "Threshold:",
          20 / zoom
        );
        return distance < 20 / zoom;
      });

      if (clickedLocation) {
        setActiveInfoBox(
          clickedLocation === activeInfoBox ? null : clickedLocation
        );
        setHighlightedLocation(
          clickedLocation === highlightedLocation ? null : clickedLocation
        );
        console.log(
          "Clicked location:",
          clickedLocation,
          "Active info box:",
          clickedLocation === activeInfoBox ? null : clickedLocation
        );
      } else {
        setActiveInfoBox(null);
        setHighlightedLocation(null);
        console.log("Clicked outside, clearing info box");
      }
    }
  };

  const canvasWidth = dimensions.width;
  const canvasHeight = dimensions.height;
  const pixelSize = mapData.pixelSize;

  const getGlobalBounds = (layers) => {
    let allX = [];
    let allY = [];
    layers.forEach((layer) => {
      allX = allX.concat(layer.pixels.filter((_, i) => i % 2 === 0));
      allY = allY.concat(layer.pixels.filter((_, i) => i % 2 === 1));
    });
    const minX = Math.min(...allX);
    const maxX = Math.max(...allX);
    const minY = Math.min(...allY);
    const maxY = Math.max(...allY);
    const dataWidth = (maxX - minX) * pixelSize;
    const dataHeight = (maxY - minY) * pixelSize;
    const scale =
      Math.min(canvasWidth / dataWidth, canvasHeight / dataHeight) * 0.9 * zoom;
    return { minX, maxX, minY, maxY, scale, dataWidth, dataHeight };
  };

  const getPoints = (pixels, isFloor, scale, minX, minY) => {
    if (!pixels || pixels.length < 4) {
      console.warn("No valid pixels for rendering");
      return [];
    }
    try {
      if (isFloor && pixels.length > 10) {
        let pointCloud = [];
        for (let i = 0; i < pixels.length; i += 2) {
          pointCloud.push([
            pixels[i] * pixelSize * scale,
            pixels[i + 1] * pixelSize * scale,
          ]);
        }
      } else {
        const wallPoints = [];
        for (let i = 0; i < pixels.length; i += 2) {
          wallPoints.push({ x: pixels[i], y: pixels[i + 1] });
        }
        const pointCloud = wallPoints.map((p) => [
          p.x * pixelSize * scale,
          p.y * pixelSize * scale,
        ]);
      }
      return pointCloud.map((coord, i) => {
        return i % 2 === 0
          ? coord - minX * pixelSize * scale + (canvasWidth - dataWidth) / 2
          : coord - minY * pixelSize * scale + (canvasHeight - dataHeight) / 2;
      });
    } catch (error) {
      console.error("Error in getPoints:", error);
      return [];
    }
  };

  const snapToGrid = (pos, enableSnap) => {
    if (!enableSnap) return pos;
    const gridSize = 50;
    const snappedX = Math.round(pos.x / gridSize) * gridSize;
    const snappedY = Math.round(pos.y / gridSize) * gridSize;
    return { x: snappedX, y: snappedY };
  };

  const renderGrid = () => {
    const gridSize = 50;
    const lines = [];
    for (let x = 0; x <= canvasWidth; x += gridSize) {
      lines.push(
        <Line
          key={`v-${x}`}
          points={[x, 0, x, canvasHeight]}
          stroke="#ccc"
          strokeWidth={1}
          dash={[5, 5]}
        />
      );
    }
    for (let y = 0; y <= canvasHeight; y += gridSize) {
      lines.push(
        <Line
          key={`h-${y}`}
          points={[0, y, canvasWidth, y]}
          stroke="#ccc"
          strokeWidth={1}
          dash={[5, 5]}
        />
      );
    }
    console.log("Rendering grid:", lines.length);
    return lines;
  };

  if (!mapData || !mapData.layers) {
    console.warn("No valid mapData provided");
    return <div>No map data available</div>;
  }

  const { minX, maxX, minY, maxY, scale, dataWidth, dataHeight } =
    getGlobalBounds(mapData.layers);

  return (
    <div
      ref={containerRef}
      style={{
        width: "70vw",
        height: "100vh",
        border: "none",
        position: "relative",
        zIndex: isPicking ? 2 : 0,
      }}
    >
      {/* 固定网格层 */}
      {showGrid && (
        <Stage
          width={canvasWidth}
          height={canvasHeight}
          draggable={false}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: -1,
          }}
        >
          <Layer>{renderGrid()}</Layer>
        </Stage>
      )}

      {/* Main Map Layer */}
      <Stage
        width={canvasWidth}
        height={canvasHeight}
        draggable={!trimMode || trimMode === "auto"}
        onDragEnd={handleDragEnd}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        style={{
          border: "none",
          cursor: isPicking && !trimMode ? "crosshair" : "default",
        }}
      >
        <Layer>
          {mapData.layers.map((layer, index) => {
            const points = getPoints(
              layer.pixels,
              (layer.type === "segment" || layer.type === "floor"),
              scale,
              minX,
              minY
            );
            return (
              <Line
                key={index}
                points={points}
                stroke={layer.type === "segment" ? "#00000" : "#FF0000"}
                strokeWidth={layer.type === "segment" ? 2 : 4}
                fill={
                  layer.type === "segment" ? "rgb(90, 119, 169)" : "none"
                }
                closed={layer.type === "segment"}
                tension={layer.type === "wall" ? 0.2 : 0}
                shadowColor="black"
                shadowBlur={layer.type === "wall" ? 5 : 0}
                shadowOffset={{ x: 2, y: 2 }}
                shadowOpacity={0.3}
                visible={layer.type === "wall" ? showWall : true}
              />
            );
          })}
          {drawingPoints.length > 0 && trimMode !== "auto" && (
            <Line
              points={drawingPoints}
              stroke="green"
              strokeWidth={trimMode === "pencil" ? 1 : 3}
              dash={trimMode === "pencil" ? [5, 5] : null}
            />
          )}
          {locations.map((loc, index) => (
            <Fragment key={index}>
              <Rect
                x={loc.x - (highlightedLocation === loc ? 10 : 6.5)}
                y={loc.y - (highlightedLocation === loc ? 10 : 6.5)}
                width={highlightedLocation === loc ? 20 : 13}
                height={highlightedLocation === loc ? 20 : 13}
                fill="#007AFF"
                stroke="white"
                strokeWidth={3}
                cornerRadius={6.5}
                shadowColor="black"
                shadowBlur={5}
                shadowOffset={{ x: 0, y: 2 }}
                shadowOpacity={0.3}
                onClick={(e) => {
                  if (isPicking) return;
                  e.cancelBubble = true;
                  setActiveInfoBox(loc === activeInfoBox ? null : loc);
                  setHighlightedLocation(
                    loc === highlightedLocation ? null : loc
                  );
                  console.log("Point clicked:", loc);
                }}
              />
              {activeInfoBox === loc && (
                <Text
                  x={loc.x + 20}
                  y={loc.y - 15}
                  text={`${loc.name || "Unknown"}\n${
                    loc.category || "No Category"
                  }\n${loc.description || "No Description"}`}
                  fontSize={12}
                  fontFamily="Poppins"
                  fill="#000"
                  padding={15}
                  backgroundColor="#000"
                  cornerRadius={20}
                  shadowColor="#007AFF"
                  shadowBlur={10}
                  shadowOffset={{ x: 0, y: 5 }}
                  shadowOpacity={0.15}
                  width={114}
                  height={66}
                  align="left"
                  verticalAlign="middle"
                />
              )}
            </Fragment>
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default FloorMap;
