import React from "react";
import SelectableItem from "../SelectableItem/SelectableItem"; // 假设路径正确

const RoomList = ({ rooms, selectedRoom, setSelectedRoom }) => {
  const handleRoomSelect = (index) => {
    setSelectedRoom(index);
    console.log("Selected room:", index);
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
              isSelected={selectedRoom === index}
              onSelect={() => handleRoomSelect(index)}
            />
          );
        })
      )}
    </div>
  );
};

export default RoomList;
