/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

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
