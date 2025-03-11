// WallList.jsx
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

  // Defensive check to ensure selectedWalls exists
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
              isSelected={false} // Default to unselected
              onSelect={() => handleSelect(wall.id)}
              className="wall-container"
              textClassName="wall-text"
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
            className="wall-container"
            textClassName="wall-text"
          />
        ))}
      </div>
    </div>
  );
};

export default WallList;
