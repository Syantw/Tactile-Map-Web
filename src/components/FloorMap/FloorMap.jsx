import { useState, useEffect, useRef } from "react";
import { Stage, Layer, Line } from "react-konva";
import hull from "hull.js";
import simplify from "simplify-js";

const FloorMap = ({ mapData }) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1); // 添加缩放状态

  // 更新尺寸
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setDimensions({ width: offsetWidth, height: offsetHeight });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // 处理滚轮缩放
  const handleWheel = (e) => {
    e.evt.preventDefault();
    const scaleBy = 1.1; // 缩放步长
    const stage = e.target.getStage();
    const oldScale = zoom;
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    setZoom(Math.min(Math.max(0.5, newScale), 3)); // 限制缩放范围 0.5x - 3x
  };

  const canvasWidth = dimensions.width;
  const canvasHeight = dimensions.height;
  const pixelSize = mapData.pixelSize;

  // 计算全局边界
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
    return { minX, maxX, minY, maxY, scale };
  };

  // 处理点的函数
  const getPoints = (pixels, isFloor, scale, minX, minY) => {
    if (!pixels || pixels.length < 4) {
      console.warn("Pixels 数据不足:", pixels);
      return [];
    }

    let scaledPoints;
    if (isFloor && pixels.length > 100) {
      const pointCloud = [];
      for (let i = 0; i < pixels.length; i += 2) {
        pointCloud.push([
          pixels[i] * pixelSize * scale,
          pixels[i + 1] * pixelSize * scale,
        ]);
      }
      scaledPoints = hull(pointCloud, 50).flat();
    } else {
      const wallPoints = [];
      for (let i = 0; i < pixels.length; i += 2) {
        wallPoints.push({ x: pixels[i], y: pixels[i + 1] });
      }
      const simplified = simplify(wallPoints, 1, true);
      const pointCloud = simplified.map((p) => [
        p.x * pixelSize * scale,
        p.y * pixelSize * scale,
      ]);
      scaledPoints = hull(pointCloud, 30).flat();
    }

    const dataWidth =
      (Math.max(...pixels.filter((_, i) => i % 2 === 0)) - minX) *
      pixelSize *
      scale;
    const dataHeight =
      (Math.max(...pixels.filter((_, i) => i % 2 === 1)) - minY) *
      pixelSize *
      scale;
    return scaledPoints.map((coord, i) => {
      return i % 2 === 0
        ? coord - minX * pixelSize * scale + (canvasWidth - dataWidth) / 2
        : coord - minY * pixelSize * scale + (canvasHeight - dataHeight) / 2;
    });
  };

  const { minX, maxX, minY, maxY, scale } = getGlobalBounds(mapData.layers);

  return (
    <div
      ref={containerRef}
      style={{
        width: "70vw",
        height: "100vh",
        border: "none", // 移除容器边框
      }}
    >
      <Stage
        width={canvasWidth}
        height={canvasHeight}
        draggable
        onWheel={handleWheel}
        style={{ border: "none" }} // 移除 canvas 边框
      >
        <Layer>
          {mapData.layers.map((layer, index) => {
            const points = getPoints(
              layer.pixels,
              layer.type === "floor",
              scale,
              minX,
              minY
            );
            if (layer.type === "floor") {
              return (
                <Line
                  key={index}
                  points={points}
                  stroke="#4682B4"
                  strokeWidth={2}
                  fill="rgba(70, 130, 180, 0.3)"
                  closed={true}
                />
              );
            } else if (layer.type === "wall") {
              return (
                <Line
                  key={index}
                  points={points}
                  stroke="#8B0000"
                  strokeWidth={4}
                  fill="none"
                  closed={false}
                  tension={0.2}
                  shadowColor="black"
                  shadowBlur={5}
                  shadowOffset={{ x: 2, y: 2 }}
                  shadowOpacity={0.3}
                />
              );
            }
            return null;
          })}
        </Layer>
      </Stage>
    </div>
  );
};

export default FloorMap;
