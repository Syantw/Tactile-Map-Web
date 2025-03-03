import React, { useState } from "react";
import { Button } from "react-bootstrap";
import PropTypes from "prop-types";

export const FileUpload = ({
  label = "Voice Annotation",
  onFileUpload,
  className = "",
}) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    console.log("File selected:", selectedFile);
  };

  const handleSubmit = () => {
    if (file && onFileUpload) {
      onFileUpload(file);
      console.log("File submitted:", file);
      setFile(null);
    } else {
      console.warn("No file selected");
    }
  };

  const styles = {
    voiceAnnotation: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      width: "100%",
    },
    textWrapper: {
      color: "#505050",
      fontFamily: "'Poppins', Helvetica",
      fontSize: "12px",
      fontWeight: 400,
      alignSelf: "stretch",
      display: "flex",
      color: "var(--black)",
      letterSpacing: 0,
      lineHeight: "normal",
      opacity: 0.5,
    },
    fileInputContainer: {
      width: "100%",
      marginBottom: "1rem",
    },
    fileInputWrapper: {
      display: "flex",
      alignItems: "center",
      backgroundColor: "#ffff",
      border: "1px solid #b8b8b8",
      borderRadius: "5px",
      height: "37px",
      cursor: "pointer",
      width: "100%",
      gap: "15px",
    },
    fileInput: {
      display: "none",
    },
    fileLabel: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      fontSize: "12px",
      fontFamily: "'Poppins', Helvetica",
      color: "#505050",
      flexGrow: 1,
    },
    svgContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "5px",
      width: "34px",
      height: "34px",
      borderRadius: "5px",
      borderRight: "1px solid #b8b8b8",
      backgroundColor: "#f4f4f4",
    },
    svgIcon: {
      width: "18px",
      height: "18px",
    },
    submitBtn: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgb(50, 116, 246)",
      borderRadius: "5px",
      gap: "7px",
      height: "37px",
      padding: "10px 20px",
      width: "301px",
      color: "white",
      fontWeight: "bold",
      border: "none",
      cursor: "pointer",
      transition: "background 0.3s ease-in-out",
    },
    submitBtnHover: {
      backgroundColor: "rgb(40, 96, 206)",
    },
    submitBtnActive: {
      backgroundColor: "rgb(30, 76, 166)",
    },
    frameImg: {
      width: "20px",
      height: "auto",
    },
  };

  return (
    <div
      className={`voiceAnnotation ${className}`}
      style={styles.voiceAnnotation}
    >
      <div style={styles.textWrapper}>{label}</div>
      <div style={styles.fileInputContainer}>
        <label htmlFor="file-upload" style={styles.fileInputWrapper}>
          <div style={styles.svgContainer}>
            <svg
              style={styles.svgIcon}
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M896 576c-17.7 0-32 14.3-32 32v137.8c0 22.9-9 44.5-25.3 60.8s-38 25.4-60.9 25.4H246.2c-22.9 0-44.5-9-60.8-25.3-16.4-16.4-25.4-38-25.4-60.9V608c0-17.7-14.3-32-32-32s-32 14.3-32 32v137.8C96 828.6 163.4 896 246.2 896h531.7c82.8 0 150.2-67.4 150.2-150.2V608c-0.1-17.7-14.4-32-32.1-32z"
                fill="#00000"
              />
              <path
                d="M422.6 294.6l57.4-57.4v402.7c0 17.6 14.4 32 32 32s32-14.4 32-32V237.2l57.4 57.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-6.2 6.2-9.4 14.4-9.4 22.6 0 8.2 3.1 16.4 9.4 22.6 12.5 12.6 32.7 12.6 45.2 0.1z"
                fill="#000000"
              />
            </svg>
          </div>
          <span style={styles.fileLabel}>
            {file ? file.name : "Choose File"}
          </span>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            style={styles.fileInput}
          />
        </label>
      </div>

      <img
        style={styles.frameImg}
        alt="Frame"
        src="https://c.animaapp.com/UTvzRI5U/img/frame-21-1.png"
      />
    </div>
  );
};

FileUpload.propTypes = {
  label: PropTypes.string,
  onFileUpload: PropTypes.func,
  className: PropTypes.string,
};
