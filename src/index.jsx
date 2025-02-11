import "../global.css";
import "../styleguide.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MacbookAir } from "./screens/MacbookAir";

createRoot(document.getElementById("app")).render(
  <StrictMode>
    <MacbookAir />
  </StrictMode>
);
