import React from "react";
import { Button } from "react-bootstrap";

export const TrimButton = ({
  property1,
  className,
  text = "Trim",
  onClick,
}) => {
  return (
    <Button
      variant="primary"
      className={`trim-button ${className}`}
      onClick={onClick}
    >
      {text}
    </Button>
  );
};
