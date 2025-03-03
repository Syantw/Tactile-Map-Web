import React, { useState } from "react";
import { Form } from "react-bootstrap";
import PropTypes from "prop-types";
import "./style.css";

export const LocationPicker = ({
  addLocation,
  setIsPicking,
  locations = [],
  className = "",
}) => {
  const [isPicking, setIsPickingLocal] = useState(false);
  const [locationName, setLocationName] = useState("");

  const handlePickLocation = () => {
    if (!isPicking) {
      setIsPickingLocal(true);
      setIsPicking(true);
      console.log("Entering picking mode");
    } else {
      setIsPickingLocal(false);
      setIsPicking(false);
      console.log("Exit picking mode");
    }
  };

  return (
    <div className={`location-picker ${className}`}>
      <div className="input-group mb-2">
        <span
          className="input-group-text"
          onClick={handlePickLocation}
          style={{
            cursor: "pointer",
            backgroundColor: isPicking ? "#3274f6" : "#f4f4f4",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
              fill={isPicking ? "#fff" : "#000"}
            />
          </svg>
        </span>
        <Form.Control
          type="text"
          placeholder="Enter location name..."
          value={locationName}
          onChange={(e) => {
            setLocationName(e.target.value);
            console.log("Location name updated:", e.target.value);
          }}
          style={{ height: "35px", fontSize: "12px" }}
        />
      </div>
    </div>
  );
};

LocationPicker.propTypes = {
  addLocation: PropTypes.func.isRequired,
  setIsPicking: PropTypes.func.isRequired,
  locations: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
      name: PropTypes.string,
      category: PropTypes.string,
    })
  ),
  className: PropTypes.string,
};

export default LocationPicker;
