import React from "react";
import { Form } from "react-bootstrap";
import PropTypes from "prop-types";
import "./style.css";

export const InputField = ({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  disabled = false,
  className = "",
  ...rest // 接收额外的 Form.Control 属性
}) => {
  return (
    <div className={`info-input ${className}`}>
      <div className="text-wrapper-10">{label}</div>
      <Form.Control
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="info-enter"
        {...rest} // 传递额外属性
      />
    </div>
  );
};

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};
