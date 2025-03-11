import React from "react";
import { TabItem } from "../TabItem";
import "./style.css";

export const TabsAndContent = ({
  property1, // "auto" or "manual"
  onTabChange,
}) => {
  return (
    <div className="tabs-and-content">
      <div className="tabButtons" onClick={() => onTabChange && onTabChange(0)}>
        <TabItem
          className="design-component-instance-node"
          property1={property1 === "auto" ? "select-auto" : "unselect-auto"}
        />
      </div>
      <div className="tabButtons" onClick={() => onTabChange && onTabChange(1)}>
        <TabItem
          className="design-component-instance-node"
          property1={
            property1 === "manual" ? "select-manual" : "unselect-manual"
          }
        />
      </div>
    </div>
  );
};
