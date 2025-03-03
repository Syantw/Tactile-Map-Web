import React, { useRef, useState, useEffect } from "react";

const DrawingCanvas = ({
  drawingMode,
  selectedModes,
  computeIntersections,
  setComputeIntersections,
  setWalls,
  showGrid,
  isPicking,
}) => {
  if (!drawingMode) return null;
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const drawingsRef = useRef([]); // 存储所有绘制的图案
  const [selectedShapeIndex, setSelectedShapeIndex] = useState(null); // 选中的图案索引
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // 记录点击时的偏移量
  const [intersections, setIntersections] = useState([]); // 存储交点

  useEffect(() => {
    if (computeIntersections) {
      console.log("Computing intersections...");
      computeAndDrawIntersections();
      setComputeIntersections(false);
    }

    redrawCanvas();

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

  const redrawCanvas = (newIntersections = intersections) => {
    const canvas = canvasRef.current;
    if (!canvas) return; // 确保 canvas 存在
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawingsRef.current.forEach((draw, index) => {
      ctx.beginPath();
      ctx.strokeStyle = index === selectedShapeIndex ? "blue" : "red";
      ctx.lineWidth = 2;

      if (draw.type === "line") {
        ctx.moveTo(draw.start.x, draw.start.y);
        ctx.lineTo(draw.end.x, draw.end.y);
      } else if (draw.type === "rectangle") {
        ctx.rect(
          draw.start.x,
          draw.start.y,
          draw.end.x - draw.start.x,
          draw.end.y - draw.start.y
        );
      } else if (draw.type === "horizontal") {
        ctx.moveTo(0, draw.start.y);
        ctx.lineTo(canvas.width, draw.start.y);
      } else if (draw.type === "vertical") {
        ctx.moveTo(draw.start.x, 0);
        ctx.lineTo(draw.start.x, canvas.height);
      } else if (draw.type === "cross") {
        ctx.moveTo(0, draw.start.y);
        ctx.lineTo(canvas.width, draw.start.y);
        ctx.moveTo(draw.start.x, 0);
        ctx.lineTo(draw.start.x, canvas.height);
      }

      ctx.stroke();
    });

    newIntersections.forEach(({ x, y }) => {
      ctx.beginPath();
      ctx.fillStyle = "yellow";
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  const handleMouseDown = (e) => {
    if (isPicking) {
      console.log("DrawingCanvas: In picking mode, drawing disabled.");
      return;
    }

    console.log("DrawingCanvas: Mouse down event triggered.", { drawingMode });

    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("DrawingCanvas: Canvas ref is not available.");
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const snapped = snapToGrid(mouseX, mouseY);

    if (drawingMode === "select") {
      const foundIndex = drawingsRef.current.findIndex(
        (shape) =>
          mouseX >= Math.min(shape.start.x, shape.end.x) &&
          mouseX <= Math.max(shape.start.x, shape.end.x) &&
          mouseY >= Math.min(shape.start.y, shape.end.y) &&
          mouseY <= Math.max(shape.start.y, shape.end.y)
      );

      if (foundIndex !== -1) {
        setSelectedShapeIndex(foundIndex);
        setIsDragging(true);
        const shape = drawingsRef.current[foundIndex];
        setOffset({ x: mouseX - shape.start.x, y: mouseY - shape.start.y });
        console.log("DrawingCanvas: Selected shape at index:", foundIndex);
      } else {
        setSelectedShapeIndex(null);
        console.log("DrawingCanvas: No shape selected.");
      }

      redrawCanvas();
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
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;
      const snapped = snapToGrid(currentX, currentY);

      const selectedShape = drawingsRef.current[selectedShapeIndex];
      const width = selectedShape.end.x - selectedShape.start.x;
      const height = selectedShape.end.y - selectedShape.start.y;

      selectedShape.start.x = snapped.x - offset.x;
      selectedShape.start.y = snapped.y - offset.y;
      selectedShape.end.x = selectedShape.start.x + width;
      selectedShape.end.y = selectedShape.start.y + height;

      redrawCanvas();
      console.log("DrawingCanvas: Dragging shape to:", snapped);
      return;
    }

    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    const snapped = snapToGrid(currentX, currentY);

    redrawCanvas();

    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;

    if (drawingMode === "line") {
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(snapped.x, snapped.y);
    } else if (drawingMode === "rectangle") {
      ctx.rect(
        startPos.x,
        startPos.y,
        snapped.x - startPos.x,
        snapped.y - startPos.y
      );
    } else if (drawingMode === "horizontal-line") {
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(snapped.x, startPos.y);
    } else if (drawingMode === "vertical-line") {
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(startPos.x, snapped.y);
    }

    ctx.stroke();
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
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("DrawingCanvas: Canvas ref is not available.");
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;
    const snappedEnd = snapToGrid(endX, endY);

    let type = "line";
    let finalEndX = snappedEnd.x;
    let finalEndY = snappedEnd.y;

    if (drawingMode === "line") {
      if (
        selectedModes.includes("Horizontal") &&
        selectedModes.includes("Vertical")
      ) {
        type = "cross";
        finalEndX = canvas.width;
        finalEndY = canvas.height;
      } else if (selectedModes.includes("Horizontal")) {
        type = "horizontal";
        finalEndX = canvas.width;
        finalEndY = startPos.y;
      } else if (selectedModes.includes("Vertical")) {
        type = "vertical";
        finalEndX = startPos.x;
        finalEndY = canvas.height;
      }
    } else if (drawingMode === "rectangle") {
      type = "rectangle";
    }
    drawingsRef.current.push({
      type,
      start: startPos,
      end: { x: finalEndX, y: finalEndY },
    });

    redrawCanvas();
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
      redrawCanvas();
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
          newIntersections.push(intersection);
          console.log(
            `✅ Intersection found at: (${intersection.x}, ${intersection.y})`
          );
        }
      }
    }

    newWalls = generateWallsFromIntersections(newIntersections);
    setWalls(newWalls);
    setIntersections(newIntersections);
    redrawCanvas(newIntersections);
  };

  const findIntersection = (shape1, shape2) => {
    console.log("🔍 Checking intersection between:", shape1, shape2);

    if (shape1.type === "line" && shape2.type === "line") {
      return getLineIntersection(
        shape1.start,
        shape1.end,
        shape2.start,
        shape2.end
      );
    }

    if (shape1.type === "horizontal" || shape2.type === "horizontal") {
      return getHorizontalIntersection(shape1, shape2);
    }
    if (shape1.type === "vertical" || shape2.type === "vertical") {
      return getVerticalIntersection(shape1, shape2);
    }

    if (shape1.type === "rectangle" || shape2.type === "rectangle") {
      return getRectangleIntersection(shape1, shape2);
    }

    if (shape1.type === "cross") {
      return getCrossIntersection(shape1, shape2);
    }
    if (shape2.type === "cross") {
      return getCrossIntersection(shape2, shape1);
    }

    console.log("❌ No intersection found.");
    return null;
  };

  const getHorizontalIntersection = (horizontal, shape) => {
    const y = horizontal.start.y;
    let intersection = null;

    if (shape.type === "line") {
      intersection = getLineIntersection(
        { x: 0, y: y },
        { x: canvasRef.current.width, y: y },
        shape.start,
        shape.end
      );
    } else if (shape.type === "vertical") {
      intersection = { x: shape.start.x, y: y };
    } else if (shape.type === "rectangle") {
      intersection = getRectangleIntersection(shape, horizontal);
    }

    return intersection;
  };

  const getVerticalIntersection = (vertical, shape) => {
    const x = vertical.start.x;
    let intersection = null;

    if (shape.type === "line") {
      intersection = getLineIntersection(
        { x: x, y: 0 },
        { x: x, y: canvasRef.current.height },
        shape.start,
        shape.end
      );
    } else if (shape.type === "horizontal") {
      intersection = { x: x, y: shape.start.y };
    } else if (shape.type === "rectangle") {
      intersection = getRectangleIntersection(shape, vertical);
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
          { x: canvasRef.current.width, y: shape.start.y }
        );
      } else if (shape.type === "vertical") {
        intersection = getLineIntersection(
          edge.start,
          edge.end,
          { x: shape.start.x, y: 0 },
          { x: shape.start.x, y: canvasRef.current.height }
        );
      } else {
        intersection = getLineIntersection(
          edge.start,
          edge.end,
          shape.start,
          shape.end
        );
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
        end: { x: canvasRef.current.width, y: cross.start.y },
      },
      {
        start: { x: cross.start.x, y: 0 },
        end: { x: cross.start.x, y: canvasRef.current.height },
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
          { x: canvasRef.current.width, y: shape.start.y }
        );
      } else if (shape.type === "vertical") {
        intersection = getLineIntersection(
          line.start,
          line.end,
          { x: shape.start.x, y: 0 },
          { x: shape.start.x, y: canvasRef.current.height }
        );
      } else {
        intersection = getLineIntersection(
          line.start,
          line.end,
          shape.start,
          shape.end
        );
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

  return (
    <canvas
      ref={canvasRef}
      width={canvasRef.current?.parentElement?.offsetWidth ?? "70%"}
      height={canvasRef.current?.parentElement?.offsetHeight ?? "100%"}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: isPicking ? 0 : 1,
        pointerEvents: isPicking ? "none" : "auto", // 禁用点击事件
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
};

export default DrawingCanvas;
