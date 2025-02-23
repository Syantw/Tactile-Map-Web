import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const LocationPicker = ({ onLocationSelect }) => {
  const [isPicking, setIsPicking] = useState(false); // 是否正在选择位置
  const [locationName, setLocationName] = useState(""); // 位置名称
  const [selectedLocation, setSelectedLocation] = useState(null); // 选择的坐标

  // 切换定位模式
  const handlePickLocation = () => {
    setIsPicking(true);
  };

  // 处理地图点击，存储坐标
  const handleMapClick = (event) => {
    if (isPicking) {
      const x = event.clientX;
      const y = event.clientY;
      setSelectedLocation({ x, y });
      setIsPicking(false);
      onLocationSelect({ x, y, name: locationName }); // 传递数据到父组件
    }
  };

  return (
    <div>
      {/* 定位输入框 */}
      <div className="input-group mb-3">
        <span
          className="input-group-text"
          onClick={handlePickLocation}
          style={{ cursor: "pointer" }}
        >
          📍
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="Enter location name..."
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
        />
      </div>

      {/* 监听地图区域的点击事件 */}
      <div
        id="mapFloor"
        onClick={handleMapClick}
        style={{
          width: "100%",
          height: "400px",
          backgroundColor: "#f0f0f0",
          position: "relative",
          cursor: isPicking ? "crosshair" : "default",
        }}
      >
        {/* 渲染选择的定位标 */}
        {selectedLocation && (
          <div
            style={{
              position: "absolute",
              top: selectedLocation.y - 10,
              left: selectedLocation.x - 10,
              width: "20px",
              height: "20px",
              backgroundColor: "red",
              borderRadius: "50%",
              textAlign: "center",
              lineHeight: "20px",
              color: "white",
              fontWeight: "bold",
            }}
          >
            📍
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationPicker;
