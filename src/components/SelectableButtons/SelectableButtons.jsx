import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const SelectableButtons = ({
  labels = [],
  selected = [],
  setSelected,
  buttonStyle = {},
}) => {
  const toggleSelection = (label) => {
    setSelected((prevSelected) =>
      prevSelected.includes(label)
        ? prevSelected.filter((item) => item !== label)
        : [...prevSelected, label]
    );
  };

  return (
    <div className="d-flex flex-wrap gap-2 justify-content-start">
      {labels.map((label) => (
        <button
          key={label}
          className="btn"
          style={{
            ...buttonStyle,
            fontWeight: "600",
            backgroundColor: selected.includes(label) ? "#3274f6" : "#6877932e",
            color: selected.includes(label) ? "white" : "grey",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            gap: "10px",
            height: "29px",
            minWidth: "80px",
            padding: "10px 20px",
            border: "none",
            transition: "0.3s",
          }}
          onClick={() => toggleSelection(label)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default SelectableButtons;
