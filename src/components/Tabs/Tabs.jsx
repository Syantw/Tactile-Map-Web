import React from "react";
import { StateSelectedWrapper } from "../StateSelectedWrapper";
import "./style.css";

export const Tabs = ({
  className,
  override = (
    <StateSelectedWrapper
      className="tab-item-instance"
      state="selected"
      text="Account"
    />
  ),
  override1 = (
    <StateSelectedWrapper
      className="tab-item-instance"
      state="unselected"
      text1="Password"
    />
  ),
}) => {
  return (
    <div className={`tabs ${className}`}>
      {override}
      {override1}
    </div>
  );
};
