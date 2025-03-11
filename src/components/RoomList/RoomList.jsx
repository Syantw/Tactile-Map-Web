// RoomList.jsx
import React from "react";
import SelectableItem from "../SelectableItem/SelectableItem"; // Ensure the path is correct
import "./style.css";

const RoomList = ({ rooms, selectedRoom, setSelectedRoom }) => {
  const handleRoomSelect = (index) => {
    // If the room is already selected, deselect it; otherwise, select it
    if (selectedRoom === index) {
      setSelectedRoom(null); // Deselect by setting to null
      console.log("Deselected room:", index);
    } else {
      setSelectedRoom(index); // Select the new room
      console.log("Selected room:", index);
    }
  };

  return (
    <div className="room-list" style={{ marginTop: "10px" }}>
      {rooms.length === 0 ? (
        <div style={{ fontSize: "12px", color: "#888" }}>
          No rooms available
        </div>
      ) : (
        rooms.map((room, index) => {
          const roomText =
            room.metadata.name || room.metadata.id
              ? `${room.metadata.name || "Unnamed"} (${
                  room.metadata.id || "No ID"
                })`
              : "none";
          return (
            <SelectableItem
              key={index}
              text={`Room ${index + 1}: ${roomText}`}
              isSelected={selectedRoom === index} // Check if the room is selected
              onSelect={() => handleRoomSelect(index)}
              className="room-container"
              textClassName="room-text"
            />
          );
        })
      )}
    </div>
  );
};

export default RoomList;
