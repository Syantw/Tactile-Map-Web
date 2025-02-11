import React, { useState } from "react";
import "./style.css";
import SelectableItem from "../SelectableItem/SelectableItem";

const WallList = ({ walls }) => {
  const [selectedWalls, setSelectedWalls] = useState([]); // Stores multiple selections

  const handleSelect = (id) => {
    setSelectedWalls((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((wallId) => wallId !== id); // Remove if already selected
      } else {
        return [...prevSelected, id]; // Add if not selected
      }
    });
  };
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
