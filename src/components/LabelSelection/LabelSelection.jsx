// LabelSelection.jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Dropdown } from "../Dropdown/DropDown";
import { InputField } from "../FieldInput/FieldInput";
import { LocationPicker } from "../LocationPicker/LocationPicker";
import SelectableButtons from "../SelectableButtons/SelectableButtons";
import { FileUpload } from "../FileUpload/FileUpload";
import CustomButton from "../CustomizedButton/CustomizedButton";
import { Form } from "react-bootstrap";

export const LabelSelection = ({
  name,
  setName,
  id,
  setId,
  entrance,
  setEntrance,
  locations,
  setLocations,
  tempLocation,
  setTempLocation,
  onFileUpload,
  setIsPicking,
  selectedRoom,
  setRooms,
  rooms,
  customLabels,
  addCustomLabel,
  facilityLabels, // Receive facility labels from MacbookAir
  addFacilityLabel, // Function to add new facility labels
}) => {
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [description, setDescription] = useState("");
  const [locationName, setLocationName] = useState("");
  const [customLabel, setCustomLabel] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Sync selectedCategory with rooms when selectedRoom or rooms changes
  useEffect(() => {
    if (selectedRoom !== null && rooms[selectedRoom]) {
      setSelectedCategory(rooms[selectedRoom].metadata.category || []);
      setName(rooms[selectedRoom].metadata.name || "");
      setId(rooms[selectedRoom].metadata.id || "");
    } else {
      setSelectedCategory([]);
      setName("");
      setId("");
    }
  }, [selectedRoom, rooms]);

  const handleAddLocation = (location) => {
    const updatedLocation = {
      ...location,
      name: locationName || `Point ${locations.length + 1}`,
    };
    setTempLocation(updatedLocation);
    console.log("Temp location set in LabelSelection:", updatedLocation);
  };

  const handleSelect = () => {
    if (tempLocation) {
      const updatedLocation = {
        ...tempLocation,
        category: selectedCategory[0] || "Unknown",
        description,
      };
      setLocations((prev) => {
        const newLocations = [...prev, updatedLocation];
        console.log("Updated locations in LabelSelection:", newLocations);
        return newLocations;
      });
      setTempLocation(null);
    }
    console.log(
      "Selected - Locations:",
      locations,
      "Category:",
      selectedCategory,
      "Description:",
      description
    );
  };

  const handleSaveRoomLabel = () => {
    if (selectedRoom !== null && rooms[selectedRoom]) {
      const updatedRoom = {
        ...rooms[selectedRoom],
        metadata: {
          ...rooms[selectedRoom].metadata,
          name,
          id,
          category: selectedCategory,
        },
      };
      setRooms((prev) => {
        const newRooms = [...prev];
        newRooms[selectedRoom] = updatedRoom;
        console.log("Saving room label:", updatedRoom);
        return newRooms;
      });
    }
  };

  const handleCustomLabelConfirm = () => {
    if (customLabel && !selectedCategory.includes(customLabel)) {
      setSelectedCategory((prev) => [...prev, customLabel]);
      if (addCustomLabel && typeof addCustomLabel === "function") {
        addCustomLabel(customLabel);
      }
      handleSaveRoomLabel();
    }
    setShowCustomInput(false);
    setCustomLabel("");
  };

  return (
    <div className="labelSelection">
      <div className="h1">Label</div>
      <Dropdown
        className="dropdown"
        options={[
          "2D Layout - Room",
          "2D Layout - Office",
          "2D Layout - Entrance",
          "2D Layout - Stair",
          "2D Layout - Elevator",
          "2D Layout - Garden",
          "2D Layout - Restroom",
          "Add More",
          ...customLabels,
        ]}
        defaultValue="2D Layout - Room"
        setShowCustomInput={setShowCustomInput}
        setCustomLabel={setCustomLabel}
        selectedCategory={selectedCategory}
        setSelectedCategory={(newCategory) => {
          setSelectedCategory(newCategory);
          handleSaveRoomLabel();
        }}
      />
      {showCustomInput && (
        <InputField
          label="Custom Label"
          value={customLabel}
          onChange={(value) => setCustomLabel(value)}
          placeholder="Enter custom label"
          type="text"
          disabled={false}
          style={{
            color: "#505050",
            fontFamily: "'Poppins', Helvetica",
            fontSize: "12px",
            width: "90%",
          }}
          onBlur={handleCustomLabelConfirm}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleCustomLabelConfirm();
            }
          }}
        />
      )}
      <div className="entrance">
        <div className="text-wrapper-10">Entrance</div>
        <div className="entrance_selector">
          <InputField
            value={entrance}
            onChange={setEntrance}
            placeholder="Pick Entrance"
            style={{ width: "100%" }}
            type="text"
            disabled={false}
          />
          <div className="entrance_list">
            <p className="entrance-location">Entrance 1 - Location </p>
            <p className="entrance-location">Entrance 3 - Location </p>
            <p className="entrance-location">Entrance 2 - Location </p>
          </div>
        </div>
      </div>
      <div
        className="info"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "90%",
        }}
      >
        <InputField
          label="Name"
          value={name}
          onChange={setName}
          placeholder="Enter name"
          type="text"
          disabled={false}
        />
        <InputField
          label="ID"
          value={id}
          onChange={setId}
          placeholder="Enter ID"
          type="text"
          disabled={false}
        />
      </div>
      <div className="facilities">
        <div className="text-wrapper-10">Facilities</div>
        <div className="facilitySelection">
          <LocationPicker
            addLocation={handleAddLocation}
            setIsPicking={setIsPicking}
            locations={locations}
            locationName={locationName}
            setLocationName={setLocationName}
          />
        </div>
        <div className="facilities-list">
          <SelectableButtons
            labels={[...facilityLabels, "+"]} // Include all facility labels and the "+" button
            selected={selectedCategory}
            setSelected={setSelectedCategory}
            addFacilityLabel={addFacilityLabel} // Pass the function to add new labels
          />
        </div>

        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Control
            as="textarea"
            rows={5}
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ fontSize: "12px", width: "100%" }}
          />
        </Form.Group>

        <CustomButton
          style={{ width: "100%", height: "29px", fontSize: "12px" }}
          onClick={handleSelect}
          disabled={selectedRoom === null && !tempLocation}
        >
          Select
        </CustomButton>
      </div>

      <div className="voiceAnnotation">
        <FileUpload label="Voice Annotation" onFileUpload={onFileUpload} />
      </div>
    </div>
  );
};

// Define propTypes after the component declaration
LabelSelection.propTypes = {
  name: PropTypes.string,
  setName: PropTypes.func,
  id: PropTypes.string,
  setId: PropTypes.func,
  entrance: PropTypes.string,
  setEntrance: PropTypes.func,
  locations: PropTypes.array,
  setLocations: PropTypes.func,
  tempLocation: PropTypes.object,
  setTempLocation: PropTypes.func,
  onFileUpload: PropTypes.func,
  setIsPicking: PropTypes.func,
  selectedRoom: PropTypes.number,
  setRooms: PropTypes.func,
  rooms: PropTypes.array,
  customLabels: PropTypes.array,
  addCustomLabel: PropTypes.func,
  facilityLabels: PropTypes.array, // Add prop type for facility labels
  addFacilityLabel: PropTypes.func, // Add prop type for adding facility labels
};

export default LabelSelection;
