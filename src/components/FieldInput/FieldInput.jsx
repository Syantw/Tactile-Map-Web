import React from "react";
import PropTypes from "prop-types";
import { Form } from "react-bootstrap";

export const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
  style,
  onBlur,
  onKeyPress,
}) => {
  return (
    <Form.Group style={style}>
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)} // Communicate value properly
        placeholder={placeholder}
        disabled={disabled}
        onBlur={onBlur}
        onKeyPress={onKeyPress}
        style={{ fontSize: "12px", height: "35px" }}
      />
    </Form.Group>
  );
};

InputField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  style: PropTypes.object,
  onBlur: PropTypes.func,
  onKeyPress: PropTypes.func,
};

export default InputField;
