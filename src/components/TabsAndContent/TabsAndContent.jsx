/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";
import { TabItem } from "../TabItem";
import { Tabs } from "../Tabs";
import "./style.css";

export const TabsAndContent = ({
  property1,
  tabs = (
    <TabItem
      className="design-component-instance-node"
      property1="unselect-manual"
    />
  ),
  override = (
    <TabItem
      className="design-component-instance-node"
      property1="select-auto"
    />
  ),
}) => {
  return (
    <div className="tabs-and-content">
      <Tabs className="tabs-instance" override={override} override1={tabs} />
    </div>
  );
};
