import React, { useState } from "react";
import { MenubarItem } from "../MenubarItem";
import "./style.css";

export const Menubar = () => {
  const [selectedItem, setSelectedItem] = useState("File"); // 选中的菜单项

  return (
    <div className="menubar">
      {["File", "Edit", "View", "Profile"].map((item) => (
        <MenubarItem
          key={item}
          text={item}
          state={selectedItem === item ? "selected" : "default"}
          onClick={() => setSelectedItem(item)}
        />
      ))}
    </div>
  );
};
