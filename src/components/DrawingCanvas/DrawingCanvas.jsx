import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Line, Rect, Circle, Shape, Text } from "react-konva";
import simplify from "simplify-js";

const DrawingCanvas = ({
  drawingMode,
  setDrawingMode,
  selectedModes,
  computeIntersections,
  setComputeIntersections,
  setWalls,
  showGrid,
  isPicking,
  selectedWalls,
  setSelectedWalls,
  detectRooms,
  setRooms,
  rooms: parentRooms,
  selectedRoom,
  setSelectedRoom, // 确保解构 setSelectedRoom
  refineMode,
}) => {
  if (!drawingMode) return null;

  const stageRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 800 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const drawingsRef = useRef([]); // 存储所有绘制的图案（仅用于线段）
  const [tempDrawing, setTempDrawing] = useState(null); // 存储临时绘制的图案
  const [selectedShapeIndex, setSelectedShapeIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [intersections, setIntersections] = useState([]);
  const [rooms, setLocalRooms] = useState(parentRooms || []); // 房间列表，包含 metadata
  const [isEditingRoomInfo, setIsEditingRoomInfo] = useState(false); // 控制信息框编辑状态
  const [editingRoomInfo, setEditingRoomInfo] = useState({ name: "", id: "" }); // 临时存储编辑中的信息
  const [error, setError] = useState(null);

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

    const deleteSelectedRoom = () => {
      if (selectedRoom !== null) {
        setRooms((prev) => {
          const newRooms = [...prev];
          newRooms.splice(selectedRoom, 1);
          return newRooms;
        });
        setLocalRooms((prev) => {
          const newRooms = [...prev];
          newRooms.splice(selectedRoom, 1);
          return newRooms;
        });
        setSelectedRoom(null);
        setIsEditingRoomInfo(false);
        setEditingRoomInfo({ name: "", id: "" });
        console.log(
          "DrawingCanvas: Deleted selected room at index:",
          selectedRoom
        );
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedShapeIndex !== null) {
          deleteSelectedShape();
        }
        if (selectedRoom !== null) {
          deleteSelectedRoom();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    drawingMode,
    selectedShapeIndex,
    selectedModes,
    computeIntersections,
    selectedRoom,
  ]);

  useEffect(() => {
    setLocalRooms(parentRooms || []);
  }, [parentRooms]);

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

    rooms.forEach((room) => {
      const points = room.points;
      const existingLeft = Math.min(points[0].x, points[2].x);
      const existingRight = Math.max(points[0].x, points[2].x);
      const existingTop = Math.min(points[0].y, points[2].y);
      const existingBottom = Math.max(points[0].y, points[2].y);

      const currentLeft = Math.min(start.x, end.x);
      const currentRight = Math.max(start.x, end.x);
      const currentTop = Math.min(start.y, end.y);
      const currentBottom = Math.max(start.y, end.y);

      if (Math.abs(currentLeft - existingRight) <= threshold) {
        if (start.x < end.x) newStart.x = existingRight;
        else newEnd.x = existingRight;
      }
      if (Math.abs(currentRight - existingLeft) <= threshold) {
        if (start.x > end.x) newStart.x = existingLeft;
        else newEnd.x = existingLeft;
      }
      if (Math.abs(currentTop - existingBottom) <= threshold) {
        if (start.y < end.y) newStart.y = existingBottom;
        else newEnd.y = existingBottom;
      }
      if (Math.abs(currentBottom - existingTop) <= threshold) {
        if (start.y > end.y) newStart.y = existingTop;
        else newEnd.y = existingTop;
      }
    });

    return { start: newStart, end: newEnd };
  };

  const handleMouseDown = (e) => {
    if (isPicking) return;

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

    if (!(e.target.nodeType && e.target.className === "Shape")) {
      setSelectedRoom(null);
      setIsEditingRoomInfo(false);
      setEditingRoomInfo({ name: "", id: "" });
    }

    if (e.target && e.target.nodeType) {
      if (e.target.nodeType === "Shape" && e.target.className === "Circle") {
        const id = e.target.attrs.id;
        setSelectedWalls((prev) =>
          prev.includes(id)
            ? prev.filter((wallId) => wallId !== id)
            : [...prev, id]
        );
        return;
      }

      if (e.target.nodeType === "Shape" && e.target.className === "Shape") {
        const roomIndex = e.target.attrs.roomIndex;
        setSelectedRoom(roomIndex);
        setEditingRoomInfo({
          name: rooms[roomIndex]?.metadata?.name || "",
          id: rooms[roomIndex]?.metadata?.id || "",
        });
        return;
      }
    }

    if (drawingMode === "line" || drawingMode === "rectangle") {
      setIsDrawing(true);
      setStartPos(snapped);
      console.log("DrawingCanvas: Started drawing at:", snapped);
    } else if (drawingMode === "select") {
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
    }
  };

  const handleMouseMove = (e) => {
    if (isPicking) return;

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
      const currentShape = { type: "rectangle", start: startPos, end: snapped };
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
    if (isPicking) return;

    console.log("DrawingCanvas: Mouse up event triggered.");

    if (isDragging) {
      setIsDragging(false);
      console.log("DrawingCanvas: Stopped dragging.");
      return;
    }

    if (drawingMode === "select") return;

    if (!isDrawing) return;

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

      const points = [
        { x: startPos.x, y: startPos.y },
        { x: snappedEnd.x, y: startPos.y },
        { x: snappedEnd.x, y: snappedEnd.y },
        { x: startPos.x, y: snappedEnd.y },
      ];
      setRooms((prev) => [...prev, { points, metadata: { name: "", id: "" } }]);
      setLocalRooms((prev) => [
        ...prev,
        { points, metadata: { name: "", id: "" } },
      ]);
      console.log("Rectangle added as room:", { points });

      setTempDrawing(null);
      return;
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
          if (Array.isArray(intersection))
            newIntersections.push(...intersection);
          else newIntersections.push(intersection);
          console.log(
            `✅ Intersection found at: ${JSON.stringify(intersection)}`
          );
        }
      }
    }

    newWalls = generateWallsFromIntersections(newIntersections);
    setWalls(newWalls);
    setIntersections(newIntersections);
  };

  const findIntersection = (shape1, shape2) => {
    console.log("🔍 Checking intersection between:", shape1, shape2);

    if (shape1.type === "rectangle")
      return getRectangleIntersection(shape1, shape2);
    if (shape2.type === "rectangle")
      return getRectangleIntersection(shape2, shape1);

    if (shape1.type === "horizontal")
      return getHorizontalIntersection(shape1, shape2);
    if (shape2.type === "horizontal")
      return getHorizontalIntersection(shape2, shape1);

    if (shape1.type === "vertical")
      return getVerticalIntersection(shape1, shape2);
    if (shape2.type === "vertical")
      return getVerticalIntersection(shape2, shape1);

    if (shape1.type === "cross") return getCrossIntersection(shape1, shape2);
    if (shape2.type === "cross") return getCrossIntersection(shape2, shape1);

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
        if (crossIntersections) intersections.push(...crossIntersections);
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
          if (intersect) intersections.push(intersect);
        });
        return intersections.length > 0 ? intersections : null;
      }

      if (intersection) intersections.push(intersection);
    });

    return intersections.length > 0 ? intersections : null;
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
        if (rectIntersections) intersections.push(...rectIntersections);
        return;
      }

      if (intersection) intersections.push(intersection);
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

  const getLineIntersection = (p1, p2, p3, p4) => {
    const a1 = p2.y - p1.y;
    const b1 = p1.x - p2.x;
    const c1 = a1 * p1.x + b1 * p1.y;

    const a2 = p4.y - p3.y;
    const b2 = p3.x - p4.x;
    const c2 = a2 * p3.x + b2 * p3.y;

    const determinant = a1 * b2 - a2 * b1;
    if (determinant === 0) return null;

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

  const generateWallsFromIntersections = (intersections) => {
    return intersections.map((intersection, index) => ({
      id: index + 1,
      position: intersection,
    }));
  };

  const handleIntersectionClick = (id) => {
    setSelectedWalls((prev) =>
      prev.includes(id) ? prev.filter((wallId) => wallId !== id) : [...prev, id]
    );
  };

  const handleRoomClick = (index) => {
    setSelectedRoom(index);
    console.log("Room selected:", index);
  };

  const getInfoBoxPosition = (room) => {
    if (!room || !room.points) return { x: 0, y: 0 };
    const points = room.points;
    const right = Math.max(points[0].x, points[2].x);
    const top = Math.min(points[0].y, points[2].y);
    return { x: right + 10, y: top };
  };

  const handleRoomInfoChange = (field, value) => {
    setEditingRoomInfo((prev) => ({ ...prev, [field]: value }));
  };

  const saveRoomInfo = (index) => {
    setRooms((prev) => {
      const newRooms = [...prev];
      newRooms[index] = {
        ...newRooms[index],
        metadata: { name: editingRoomInfo.name, id: editingRoomInfo.id },
      };
      return newRooms;
    });
    setLocalRooms((prev) => {
      const newRooms = [...prev];
      newRooms[index] = {
        ...newRooms[index],
        metadata: { name: editingRoomInfo.name, id: editingRoomInfo.id },
      };
      return newRooms;
    });
    setIsEditingRoomInfo(false);
  };

  const cancelRoomInfoEdit = (index) => {
    setEditingRoomInfo({
      name: rooms[index]?.metadata?.name || "",
      id: rooms[index]?.metadata?.id || "",
    });
    setIsEditingRoomInfo(false);
  };

  const getRoomBounds = (room) => {
    if (!room || !room.points)
      return {
        minX: 0,
        minY: 0,
        maxX: dimensions.width,
        maxY: dimensions.height,
      };
    const points = room.points;
    const minX = Math.min(...points.map((p) => p.x));
    const minY = Math.min(...points.map((p) => p.y));
    const maxX = Math.max(...points.map((p) => p.x));
    const maxY = Math.max(...points.map((p) => p.y));
    return { minX, minY, maxX, maxY };
  };

  const scaleFactor = refineMode && selectedRoom !== null ? 2 : 1; // 放大系数
  const roomToShow =
    refineMode && selectedRoom !== null ? rooms[selectedRoom] : null;
  const bounds = roomToShow
    ? getRoomBounds(roomToShow)
    : { minX: 0, minY: 0, maxX: dimensions.width, maxY: dimensions.height };
  const offsetX =
    refineMode && selectedRoom !== null
      ? (-bounds.minX * (scaleFactor - 1)) / 2
      : 0;
  const offsetY =
    refineMode && selectedRoom !== null
      ? (-bounds.minY * (scaleFactor - 1)) / 2
      : 0;

  if (error) return <div>Error in DrawingCanvas: {error.message}</div>;

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
        width={
          dimensions.width *
          (refineMode && selectedRoom !== null ? scaleFactor : 1)
        }
        height={
          dimensions.height *
          (refineMode && selectedRoom !== null ? scaleFactor : 1)
        }
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: isPicking ? 0 : 1,
          pointerEvents: isPicking ? "none" : "auto",
          transformOrigin: "0 0",
          transform:
            refineMode && selectedRoom !== null
              ? `scale(${scaleFactor}) translate(${offsetX}px, ${offsetY}px)`
              : "none",
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
                  height={Math.abs(draw.end.y - draw.end.y)}
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
              id={String(index + 1)}
              x={point.x}
              y={point.y}
              radius={selectedWalls.includes(index + 1) ? 7 : 5}
              fill={selectedWalls.includes(index + 1) ? "orange" : "yellow"}
              stroke="black"
              strokeWidth={1}
              hitStrokeWidth={10}
              onClick={() => handleIntersectionClick(index + 1)}
              onTap={() => handleIntersectionClick(index + 1)}
            />
          ))}

          {(!refineMode || selectedRoom === null) &&
            rooms.map((room, index) => (
              <React.Fragment key={index}>
                <Shape
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
                {selectedRoom !== index &&
                  room.metadata &&
                  (room.metadata.name || room.metadata.id) && (
                    <>
                      <Rect
                        x={getInfoBoxPosition(room).x - 5}
                        y={getInfoBoxPosition(room).y - 5}
                        width={120}
                        height={24}
                        fill="white"
                        cornerRadius={5}
                        shadowBlur={5}
                        shadowOffset={{ x: 2, y: 2 }}
                        shadowOpacity={0.3}
                      />
                      <Text
                        x={getInfoBoxPosition(room).x}
                        y={getInfoBoxPosition(room).y}
                        text={`${room.metadata.name || "Unnamed"} (${
                          room.metadata.id || "No ID"
                        })`}
                        fontSize={12}
                        fill="black"
                        fontStyle="bold"
                      />
                    </>
                  )}
              </React.Fragment>
            ))}

          {refineMode && selectedRoom !== null && roomToShow && (
            <React.Fragment>
              <Shape
                roomIndex={selectedRoom}
                sceneFunc={(context, shape) => {
                  context.beginPath();
                  const points = roomToShow.points.map((p) => ({
                    x: p.x * scaleFactor,
                    y: p.y * scaleFactor,
                  }));
                  context.moveTo(points[0].x, points[0].y);
                  for (let i = 1; i < points.length; i++) {
                    context.lineTo(points[i].x, points[i].y);
                  }
                  context.closePath();
                  context.fillStrokeShape(shape);
                }}
                fill="rgba(0, 128, 255, 0.3)" // 高亮显示
                stroke="blue"
                strokeWidth={2}
              />
              <Rect
                x={getInfoBoxPosition(roomToShow).x * scaleFactor - 5}
                y={getInfoBoxPosition(roomToShow).y * scaleFactor - 5}
                width={120}
                height={24}
                fill="white"
                cornerRadius={5}
                shadowBlur={5}
                shadowOffset={{ x: 2, y: 2 }}
                shadowOpacity={0.3}
              />
              <Text
                x={getInfoBoxPosition(roomToShow).x * scaleFactor}
                y={getInfoBoxPosition(roomToShow).y * scaleFactor}
                text={`${roomToShow.metadata.name || "Unnamed"} (${
                  roomToShow.metadata.id || "No ID"
                })`}
                fontSize={12}
                fill="black"
                fontStyle="bold"
              />
            </React.Fragment>
          )}
        </Layer>
      </Stage>

      {selectedRoom !== null && rooms[selectedRoom] && !refineMode && (
        <div
          style={{
            position: "absolute",
            top: getInfoBoxPosition(rooms[selectedRoom]).y,
            left: getInfoBoxPosition(rooms[selectedRoom]).x,
            backgroundColor: "white",
            border: "1px solid #ccc",
            padding: "15px",
            zIndex: 10,
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "220px",
              gap: "10px",
            }}
          >
            <div>
              <label style={{ fontSize: "12px", color: "#333" }}>Name:</label>
              <input
                type="text"
                value={
                  isEditingRoomInfo
                    ? editingRoomInfo.name
                    : rooms[selectedRoom].metadata.name
                }
                onChange={(e) => handleRoomInfoChange("name", e.target.value)}
                placeholder="Enter name"
                disabled={!isEditingRoomInfo}
                style={{
                  marginLeft: "5px",
                  width: "90px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
                  transition: "border-color 0.3s, box-shadow 0.3s",
                  fontSize: "12px",
                }}
                onMouseEnter={(e) => {
                  if (isEditingRoomInfo) {
                    e.target.style.borderColor = "#2196F3";
                    e.target.style.boxShadow =
                      "inset 0 1px 3px rgba(0,0,0,0.1), 0 0 5px rgba(33,150,243,0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "#ccc";
                  e.target.style.boxShadow = "inset 0 1px 3px rgba(0,0,0,0.1)";
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: "12px", color: "#333" }}>ID:</label>
              <input
                type="text"
                value={
                  isEditingRoomInfo
                    ? editingRoomInfo.id
                    : rooms[selectedRoom].metadata.id
                }
                onChange={(e) => handleRoomInfoChange("id", e.target.value)}
                placeholder="Enter ID"
                disabled={!isEditingRoomInfo}
                style={{
                  marginLeft: "5px",
                  width: "90px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
                  transition: "border-color 0.3s, box-shadow 0.3s",
                  fontSize: "12px",
                }}
                onMouseEnter={(e) => {
                  if (isEditingRoomInfo) {
                    e.target.style.borderColor = "#2196F3";
                    e.target.style.boxShadow =
                      "inset 0 1px 3px rgba(0,0,0,0.1), 0 0 5px rgba(33,150,243,0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "#ccc";
                  e.target.style.boxShadow = "inset 0 1px 3px rgba(0,0,0,0.1)";
                }}
              />
            </div>
          </div>
          <div style={{ marginTop: "10px", display: "flex", gap: "5px" }}>
            {isEditingRoomInfo ? (
              <>
                <button
                  onClick={() => saveRoomInfo(selectedRoom)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "3px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => cancelRoomInfoEdit(selectedRoom)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "3px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditingRoomInfo(true)}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#2196F3",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DrawingCanvas;
