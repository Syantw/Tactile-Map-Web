import React, { useState } from "react";
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
}) => {
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [description, setDescription] = useState("");
  const [locationName, setLocationName] = useState(""); // 新增：存储 locationName

  const handleAddLocation = (location) => {
    const updatedLocation = {
      ...location,
      name: locationName || `Point ${locations.length + 1}`, // 使用 locationName
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

  return (
    <div className="labelSelection">
      <div className="h1">Label</div>
      <Dropdown
        className="dropdown"
        options={["2D Layout - Room", "3D View", "Map Overview"]}
        defaultValue="2D Layout - Room"
      />
      <div className="entrance">
        <div className="text-wrapper-10">Entrance</div>
        <div className="entrance_selector">
          <InputField
            value={entrance}
            onChange={setEntrance}
            placeholder="Pick Entrance"
            type="text"
            disabled={false}
          />
          <div className="entrance_list">
            <p className="entrance-location">Entrance 1 - Location ></p>
            <p className="entrance-location">Entrance 3 - Location ></p>
            <p className="entrance-location">Entrance 2 - Location ></p>
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
            labels={[
              "Exhibition",
              "Elevator",
              "Service",
              "Restrooms",
              "Landmarks",
              "Obstacles",
            ]}
            selected={selectedCategory}
            setSelected={setSelectedCategory}
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

export default LabelSelection;
