import React, { useState } from "react";
import "./style.css";
import SelectableItem from "../SelectableItem/SelectableItem";

const WallList = ({ walls, setSelectedWalls, selectedWalls }) => {
  const handleSelect = (id) => {
    setSelectedWalls((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((wallId) => wallId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  // 防护性检查，确保 selectedWalls 存在
  if (!selectedWalls) {
    console.warn(
      "selectedWalls is undefined in WallList. Using default empty array."
    );
    return (
      <div className="flex-obejct">
        <div className="frame-13">
          {walls.map((wall, index) => (
            <SelectableItem
              key={wall.id}
              text={`Corner - #${wall.id}`}
              isSelected={false} // 默认未选中
              onSelect={() => handleSelect(wall.id)}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-obejct">
      <div className="frame-13">
        {walls.map((wall, index) => (
          <SelectableItem
            key={wall.id}
            text={`Corner - #${wall.id}`}
            isSelected={selectedWalls.includes(wall.id)}
            onSelect={() => handleSelect(wall.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default WallList;
