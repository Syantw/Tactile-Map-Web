import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Line, Rect, Circle, Shape } from "react-konva";
import simplify from "simplify-js";

const DrawingCanvas = ({
  drawingMode,
  selectedModes,
  computeIntersections,
  setComputeIntersections,
  setWalls,
  showGrid,
  isPicking,
  selectedWalls,
  setSelectedWalls,
}) => {
  if (!drawingMode) return null;

  const stageRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 800 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const drawingsRef = useRef([]); // 存储所有绘制的图案
  const [tempDrawing, setTempDrawing] = useState(null); // 存储临时绘制的图案
  const [selectedShapeIndex, setSelectedShapeIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [intersections, setIntersections] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [error, setError] = useState(null); // 错误边界状态

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setDimensions({ width: offsetWidth, height: offsetHeight });
        console.log("DrawingCanvas dimensions updated:", {
          width: offsetWidth,
          height: offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (computeIntersections) {
      console.log("Computing intersections...");
      computeAndDrawIntersections();
      setComputeIntersections(false);
    }

    const handleKeyDown = (e) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        deleteSelectedShape();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [drawingMode, selectedShapeIndex, selectedModes, computeIntersections]);

  const snapToGrid = (x, y) => {
    if (!showGrid) return { x, y };
    const gridSize = 50;
    const snappedX = Math.round(x / gridSize) * gridSize;
    const snappedY = Math.round(y / gridSize) * gridSize;
    return { x: snappedX, y: snappedY };
  };

  const snapToNearbyRectangle = (currentShape) => {
    const threshold = 10;
    const { start, end } = currentShape;
    let newStart = { ...start };
    let newEnd = { ...end };

    drawingsRef.current.forEach((shape) => {
      if (shape === currentShape || shape.type !== "rectangle") return;

      const { start: existingStart, end: existingEnd } = shape;
      const existingLeft = Math.min(existingStart.x, existingEnd.x);
      const existingRight = Math.max(existingStart.x, existingEnd.x);
      const existingTop = Math.min(existingStart.y, existingEnd.y);
      const existingBottom = Math.max(existingStart.y, existingEnd.y);

      const currentLeft = Math.min(start.x, end.x);
      const currentRight = Math.max(start.x, end.x);
      const currentTop = Math.min(start.y, end.y);
      const currentBottom = Math.max(start.y, end.y);

      if (Math.abs(currentLeft - existingRight) <= threshold) {
        if (start.x < end.x) {
          newStart.x = existingRight;
        } else {
          newEnd.x = existingRight;
        }
      }
      if (Math.abs(currentRight - existingLeft) <= threshold) {
        if (start.x > end.x) {
          newStart.x = existingLeft;
        } else {
          newEnd.x = existingLeft;
        }
      }
      if (Math.abs(currentTop - existingBottom) <= threshold) {
        if (start.y < end.y) {
          newStart.y = existingBottom;
        } else {
          newEnd.y = existingBottom;
        }
      }
      if (Math.abs(currentBottom - existingTop) <= threshold) {
        if (start.y > end.y) {
          newStart.y = existingTop;
        } else {
          newEnd.y = existingTop;
        }
      }
    });

    return { start: newStart, end: newEnd };
  };

  const handleMouseDown = (e) => {
    if (isPicking) {
      console.log("DrawingCanvas: In picking mode, drawing disabled.");
      return;
    }

    console.log("DrawingCanvas: Mouse down event triggered.", { drawingMode });
    console.log("Event target:", e.target);

    const stage = e.target.getStage();
    if (!stage) {
      console.error("DrawingCanvas: Stage not found.");
      return;
    }

    const pos = stage.getPointerPosition();
    if (!pos) {
      console.error("DrawingCanvas: Pointer position not found.");
      return;
    }

    const snapped = snapToGrid(pos.x, pos.y);

    // 确保 e.target 存在且是 Konva 节点
    if (e.target && e.target.nodeType) {
      // 使用 nodeType 检查是否为 Konva 节点
      if (e.target.nodeType === "Shape" && e.target.className === "Circle") {
        // 点击了交点
        const id = e.target.attrs.id;
        setSelectedWalls((prevSelected) => {
          if (prevSelected.includes(id)) {
            return prevSelected.filter((wallId) => wallId !== id);
          } else {
            return [...prevSelected, id];
          }
        });
        return;
      }

      if (e.target.nodeType === "Shape" && e.target.className === "Shape") {
        // 点击了房间
        const roomIndex = e.target.attrs.roomIndex;
        setSelectedRoom(roomIndex);
        console.log("Room selected:", roomIndex);
        return;
      }
    }

    if (drawingMode === "select") {
      const foundIndex = drawingsRef.current.findIndex((shape) => {
        if (shape.type === "rectangle") {
          return (
            pos.x >= Math.min(shape.start.x, shape.end.x) &&
            pos.x <= Math.max(shape.start.x, shape.end.x) &&
            pos.y >= Math.min(shape.start.y, shape.end.y) &&
            pos.y <= Math.max(shape.start.y, shape.end.y)
          );
        }
        return false;
      });

      if (foundIndex !== -1) {
        setSelectedShapeIndex(foundIndex);
        setIsDragging(true);
        const shape = drawingsRef.current[foundIndex];
        setOffset({ x: pos.x - shape.start.x, y: pos.y - shape.start.y });
        console.log("DrawingCanvas: Selected shape at index:", foundIndex);
      } else {
        setSelectedShapeIndex(null);
        console.log("DrawingCanvas: No shape selected.");
      }
      return;
    } else {
      setIsDrawing(true);
      setStartPos(snapped);
      console.log("DrawingCanvas: Started drawing at:", snapped);
    }
  };

  const handleMouseMove = (e) => {
    if (isPicking) {
      console.log("DrawingCanvas: In picking mode, drawing disabled.");
      return;
    }

    if (isDragging && selectedShapeIndex !== null) {
      const stage = e.target.getStage();
      const pos = stage.getPointerPosition();
      const snapped = snapToGrid(pos.x, pos.y);

      const selectedShape = drawingsRef.current[selectedShapeIndex];
      const width = selectedShape.end.x - selectedShape.start.x;
      const height = selectedShape.end.y - selectedShape.start.y;

      selectedShape.start.x = snapped.x - offset.x;
      selectedShape.start.y = snapped.y - offset.y;
      selectedShape.end.x = selectedShape.start.x + width;
      selectedShape.end.y = selectedShape.start.y + height;

      console.log("DrawingCanvas: Dragging shape to:", snapped);
      return;
    }

    if (!isDrawing) return;

    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    let snapped = snapToGrid(pos.x, pos.y);

    if (drawingMode === "rectangle") {
      const currentShape = {
        type: "rectangle",
        start: startPos,
        end: snapped,
      };
      const snappedShape = snapToNearbyRectangle(currentShape);
      snapped = snappedShape.end;
    }

    setTempDrawing({
      type: drawingMode === "line" ? "line" : "rectangle",
      start: startPos,
      end: snapped,
    });

    console.log("DrawingCanvas: Drawing in progress to:", snapped);
  };

  const handleMouseUp = (e) => {
    if (isPicking) {
      console.log("DrawingCanvas: In picking mode, drawing disabled.");
      return;
    }

    console.log("DrawingCanvas: Mouse up event triggered.");

    if (isDragging) {
      setIsDragging(false);
      console.log("DrawingCanvas: Stopped dragging.");
      return;
    }

    if (drawingMode === "select") return;

    setIsDrawing(false);
    const stage = e.target.getStage();
    if (!stage) {
      console.error("DrawingCanvas: Stage not found.");
      return;
    }

    const pos = stage.getPointerPosition();
    let snappedEnd = snapToGrid(pos.x, pos.y);

    if (drawingMode === "rectangle") {
      const currentShape = {
        type: "rectangle",
        start: startPos,
        end: snappedEnd,
      };
      const snappedShape = snapToNearbyRectangle(currentShape);
      snappedEnd = snappedShape.end;
    }

    let type = "line";
    let finalEndX = snappedEnd.x;
    let finalEndY = snappedEnd.y;

    if (drawingMode === "line") {
      if (
        selectedModes.includes("Horizontal") &&
        selectedModes.includes("Vertical")
      ) {
        type = "cross";
        finalEndX = stage.width();
        finalEndY = stage.height();
      } else if (selectedModes.includes("Horizontal")) {
        type = "horizontal";
        finalEndX = stage.width();
        finalEndY = startPos.y;
      } else if (selectedModes.includes("Vertical")) {
        type = "vertical";
        finalEndX = startPos.x;
        finalEndY = stage.height();
      }
    } else if (drawingMode === "rectangle") {
      type = "rectangle";
    }

    drawingsRef.current.push({
      type,
      start: startPos,
      end: { x: finalEndX, y: finalEndY },
    });

    setTempDrawing(null);

    console.log("DrawingCanvas: Finished drawing:", {
      type,
      start: startPos,
      end: { x: finalEndX, y: finalEndY },
    });
  };

  const deleteSelectedShape = () => {
    if (selectedShapeIndex !== null) {
      drawingsRef.current.splice(selectedShapeIndex, 1);
      setSelectedShapeIndex(null);
      console.log(
        "DrawingCanvas: Deleted selected shape at index:",
        selectedShapeIndex
      );
    }
  };

  const computeAndDrawIntersections = () => {
    console.log("🔬 Analyzing intersections...");
    console.log("📌 Total drawn shapes:", drawingsRef.current.length);

    let newIntersections = [];
    let newWalls = [];

    for (let i = 0; i < drawingsRef.current.length; i++) {
      for (let j = i + 1; j < drawingsRef.current.length; j++) {
        console.log(
          "Checking intersection between:",
          drawingsRef.current[i],
          drawingsRef.current[j]
        );
        const intersection = findIntersection(
          drawingsRef.current[i],
          drawingsRef.current[j]
        );
        if (intersection) {
          if (Array.isArray(intersection)) {
            newIntersections.push(...intersection);
          } else {
            newIntersections.push(intersection);
          }
          console.log(
            `✅ Intersection found at: ${JSON.stringify(intersection)}`
          );
        }
      }
    }

    newWalls = generateWallsFromIntersections(newIntersections);
    setWalls(newWalls);
    setIntersections(newIntersections);

    detectRooms(newIntersections);
  };

  const findIntersection = (shape1, shape2) => {
    console.log("🔍 Checking intersection between:", shape1, shape2);

    if (shape1.type === "rectangle") {
      return getRectangleIntersection(shape1, shape2);
    }
    if (shape2.type === "rectangle") {
      return getRectangleIntersection(shape2, shape1);
    }

    if (shape1.type === "horizontal") {
      return getHorizontalIntersection(shape1, shape2);
    }
    if (shape2.type === "horizontal") {
      return getHorizontalIntersection(shape2, shape1);
    }

    if (shape1.type === "vertical") {
      return getVerticalIntersection(shape1, shape2);
    }
    if (shape2.type === "vertical") {
      return getVerticalIntersection(shape2, shape1);
    }

    if (shape1.type === "cross") {
      return getCrossIntersection(shape1, shape2);
    }
    if (shape2.type === "cross") {
      return getCrossIntersection(shape2, shape1);
    }

    if (shape1.type === "line" && shape2.type === "line") {
      return getLineIntersection(
        shape1.start,
        shape1.end,
        shape2.start,
        shape2.end
      );
    }

    console.log("❌ No intersection found.");
    return null;
  };

  const getHorizontalIntersection = (horizontal, shape) => {
    const y = horizontal.start.y;
    let intersection = null;

    if (shape.type === "line") {
      intersection = getLineIntersection(
        { x: 0, y },
        { x: stageRef.current?.width() || dimensions.width, y },
        shape.start,
        shape.end
      );
    } else if (shape.type === "vertical") {
      intersection = { x: shape.start.x, y };
    } else if (shape.type === "rectangle") {
      intersection = getRectangleIntersection(shape, horizontal);
    } else if (shape.type === "cross") {
      return getCrossIntersection(shape, horizontal);
    }

    return intersection;
  };

  const getVerticalIntersection = (vertical, shape) => {
    const x = vertical.start.x;
    let intersection = null;

    if (shape.type === "line") {
      intersection = getLineIntersection(
        { x, y: 0 },
        { x, y: stageRef.current?.height() || dimensions.height },
        shape.start,
        shape.end
      );
    } else if (shape.type === "horizontal") {
      intersection = { x, y: shape.start.y };
    } else if (shape.type === "rectangle") {
      intersection = getRectangleIntersection(shape, vertical);
    } else if (shape.type === "cross") {
      return getCrossIntersection(shape, vertical);
    }

    return intersection;
  };

  const getRectangleIntersection = (rect, shape) => {
    const rectEdges = [
      {
        start: { x: rect.start.x, y: rect.start.y },
        end: { x: rect.end.x, y: rect.start.y },
      },
      {
        start: { x: rect.end.x, y: rect.start.y },
        end: { x: rect.end.x, y: rect.end.y },
      },
      {
        start: { x: rect.end.x, y: rect.end.y },
        end: { x: rect.start.x, y: rect.end.y },
      },
      {
        start: { x: rect.start.x, y: rect.end.y },
        end: { x: rect.start.x, y: rect.start.y },
      },
    ];

    let intersections = [];

    rectEdges.forEach((edge) => {
      let intersection = null;

      if (shape.type === "horizontal") {
        intersection = getLineIntersection(
          edge.start,
          edge.end,
          { x: 0, y: shape.start.y },
          { x: stageRef.current?.width() || dimensions.width, y: shape.start.y }
        );
      } else if (shape.type === "vertical") {
        intersection = getLineIntersection(
          edge.start,
          edge.end,
          { x: shape.start.x, y: 0 },
          {
            x: shape.start.x,
            y: stageRef.current?.height() || dimensions.height,
          }
        );
      } else if (shape.type === "line") {
        intersection = getLineIntersection(
          edge.start,
          edge.end,
          shape.start,
          shape.end
        );
      } else if (shape.type === "cross") {
        const crossIntersections = getCrossIntersection(shape, {
          type: "line",
          start: edge.start,
          end: edge.end,
        });
        if (crossIntersections) {
          intersections.push(...crossIntersections);
        }
        return;
      } else if (shape.type === "rectangle") {
        const shapeEdges = [
          {
            start: { x: shape.start.x, y: shape.start.y },
            end: { x: shape.end.x, y: shape.start.y },
          },
          {
            start: { x: shape.end.x, y: shape.start.y },
            end: { x: shape.end.x, y: shape.end.y },
          },
          {
            start: { x: shape.end.x, y: shape.end.y },
            end: { x: shape.start.x, y: shape.end.y },
          },
          {
            start: { x: shape.start.x, y: shape.end.y },
            end: { x: shape.start.x, y: shape.start.y },
          },
        ];

        shapeEdges.forEach((shapeEdge) => {
          const intersect = getLineIntersection(
            edge.start,
            edge.end,
            shapeEdge.start,
            shapeEdge.end
          );
          if (intersect) {
            intersections.push(intersect);
          }
        });
        return intersections.length > 0 ? intersections : null;
      }

      if (intersection) {
        intersections.push(intersection);
      }
    });

    return intersections.length > 0 ? intersections : null;
  };

  const getLineIntersection = (p1, p2, p3, p4) => {
    const a1 = p2.y - p1.y;
    const b1 = p1.x - p2.x;
    const c1 = a1 * p1.x + b1 * p1.y;

    const a2 = p4.y - p3.y;
    const b2 = p3.x - p4.x;
    const c2 = a2 * p3.x + b2 * p3.y;

    const determinant = a1 * b2 - a2 * b1;
    if (determinant === 0) {
      return null;
    }

    const x = (b2 * c1 - b1 * c2) / determinant;
    const y = (a1 * c2 - a2 * c1) / determinant;

    if (
      Math.min(p1.x, p2.x) <= x &&
      x <= Math.max(p1.x, p2.x) &&
      Math.min(p1.y, p2.y) <= y &&
      y <= Math.max(p1.y, p2.y) &&
      Math.min(p3.x, p4.x) <= x &&
      x <= Math.max(p3.x, p4.x) &&
      Math.min(p3.y, p4.y) <= y &&
      y <= Math.max(p3.y, p4.y)
    ) {
      return { x, y };
    }
    return null;
  };

  const getCrossIntersection = (cross, shape) => {
    console.log(
      `🔎 Checking cross intersection: Cross(${cross.start.x}, ${cross.start.y})`
    );

    const crossLines = [
      {
        start: { x: 0, y: cross.start.y },
        end: {
          x: stageRef.current?.width() || dimensions.width,
          y: cross.start.y,
        },
      },
      {
        start: { x: cross.start.x, y: 0 },
        end: {
          x: cross.start.x,
          y: stageRef.current?.height() || dimensions.height,
        },
      },
    ];

    let intersections = [];

    crossLines.forEach((line) => {
      let intersection = null;

      if (shape.type === "horizontal") {
        intersection = getLineIntersection(
          line.start,
          line.end,
          { x: 0, y: shape.start.y },
          { x: stageRef.current?.width() || dimensions.width, y: shape.start.y }
        );
      } else if (shape.type === "vertical") {
        intersection = getLineIntersection(
          line.start,
          line.end,
          { x: shape.start.x, y: 0 },
          {
            x: shape.start.x,
            y: stageRef.current?.height() || dimensions.height,
          }
        );
      } else if (shape.type === "line") {
        intersection = getLineIntersection(
          line.start,
          line.end,
          shape.start,
          shape.end
        );
      } else if (shape.type === "rectangle") {
        const rectIntersections = getRectangleIntersection(
          { type: "rectangle", start: shape.start, end: shape.end },
          { type: "line", start: line.start, end: line.end }
        );
        if (rectIntersections) {
          intersections.push(...rectIntersections);
        }
        return;
      }

      if (intersection) {
        intersections.push(intersection);
      }
    });

    if (intersections.length > 0) {
      console.log(
        `✅ Cross intersection found at: ${JSON.stringify(intersections)}`
      );
      return intersections;
    }

    console.log("❌ No intersection with cross.");
    return null;
  };

  const generateWallsFromIntersections = (intersections) => {
    return intersections.map((intersection, index) => ({
      id: index + 1,
      position: intersection,
    }));
  };

  const detectRooms = (intersections) => {
    const selectedPoints = intersections.filter((point, index) =>
      selectedWalls.includes(index + 1)
    );

    if (selectedPoints.length < 3) return;

    const points = selectedPoints.map((point) => ({
      x: point.x,
      y: point.y,
    }));

    setRooms((prev) => [...prev, { points }]);
    console.log("Room detected:", { points });
  };

  const handleIntersectionClick = (id) => {
    setSelectedWalls((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((wallId) => wallId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleRoomClick = (index) => {
    setSelectedRoom(index);
    console.log("Room selected:", index);
  };

  // 错误边界：捕获渲染错误
  if (error) {
    return <div>Error in DrawingCanvas: {error.message}</div>;
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "70vw",
        height: "100vh",
      }}
    >
      <Stage
        ref={stageRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: isPicking ? 0 : 1,
          pointerEvents: isPicking ? "none" : "auto",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {drawingsRef.current.map((draw, index) => {
            if (draw.type === "line") {
              return (
                <Line
                  key={index}
                  points={[draw.start.x, draw.start.y, draw.end.x, draw.end.y]}
                  stroke={index === selectedShapeIndex ? "blue" : "red"}
                  strokeWidth={2}
                />
              );
            } else if (draw.type === "rectangle") {
              return (
                <Rect
                  key={index}
                  x={Math.min(draw.start.x, draw.end.x)}
                  y={Math.min(draw.start.y, draw.end.y)}
                  width={Math.abs(draw.end.x - draw.start.x)}
                  height={Math.abs(draw.end.y - draw.start.y)}
                  stroke={index === selectedShapeIndex ? "blue" : "red"}
                  strokeWidth={2}
                />
              );
            } else if (draw.type === "horizontal") {
              return (
                <Line
                  key={index}
                  points={[0, draw.start.y, dimensions.width, draw.start.y]}
                  stroke={index === selectedShapeIndex ? "blue" : "red"}
                  strokeWidth={2}
                />
              );
            } else if (draw.type === "vertical") {
              return (
                <Line
                  key={index}
                  points={[draw.start.x, 0, draw.start.x, dimensions.height]}
                  stroke={index === selectedShapeIndex ? "blue" : "red"}
                  strokeWidth={2}
                />
              );
            } else if (draw.type === "cross") {
              return (
                <React.Fragment key={index}>
                  <Line
                    points={[0, draw.start.y, dimensions.width, draw.start.y]}
                    stroke={index === selectedShapeIndex ? "blue" : "red"}
                    strokeWidth={2}
                  />
                  <Line
                    points={[draw.start.x, 0, draw.start.x, dimensions.height]}
                    stroke={index === selectedShapeIndex ? "blue" : "red"}
                    strokeWidth={2}
                  />
                </React.Fragment>
              );
            }
            return null;
          })}

          {tempDrawing && (
            <>
              {tempDrawing.type === "line" && (
                <Line
                  points={[
                    tempDrawing.start.x,
                    tempDrawing.start.y,
                    tempDrawing.end.x,
                    tempDrawing.end.y,
                  ]}
                  stroke="blue"
                  strokeWidth={2}
                />
              )}
              {tempDrawing.type === "rectangle" && (
                <Rect
                  x={Math.min(tempDrawing.start.x, tempDrawing.end.x)}
                  y={Math.min(tempDrawing.start.y, tempDrawing.end.y)}
                  width={Math.abs(tempDrawing.end.x - tempDrawing.start.x)}
                  height={Math.abs(tempDrawing.end.y - tempDrawing.start.y)}
                  stroke="blue"
                  strokeWidth={2}
                />
              )}
            </>
          )}

          {intersections.map((point, index) => (
            <Circle
              key={index}
              id={String(index + 1)} // 确保 id 是字符串
              x={point.x}
              y={point.y}
              radius={selectedWalls.includes(index + 1) ? 7 : 5}
              fill={selectedWalls.includes(index + 1) ? "orange" : "yellow"}
              stroke="black"
              strokeWidth={1}
              onClick={() => handleIntersectionClick(index + 1)}
              onTap={() => handleIntersectionClick(index + 1)}
            />
          ))}

          {rooms.map((room, index) => (
            <Shape
              key={index}
              roomIndex={index}
              sceneFunc={(context, shape) => {
                context.beginPath();
                const points = room.points;
                context.moveTo(points[0].x, points[0].y);
                for (let i = 1; i < points.length; i++) {
                  context.lineTo(points[i].x, points[i].y);
                }
                context.closePath();
                context.fillStrokeShape(shape);
              }}
              fill={
                selectedRoom === index
                  ? "rgba(0, 128, 255, 0.3)"
                  : "rgba(0, 255, 0, 0.2)"
              }
              stroke={selectedRoom === index ? "blue" : "green"}
              strokeWidth={2}
              onClick={() => handleRoomClick(index)}
              onTap={() => handleRoomClick(index)}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default DrawingCanvas;
