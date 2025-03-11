import "../global.css";
import "../styleguide.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import APP from "./Pages/APP";

createRoot(document.getElementById("app")).render(
  <StrictMode>
    <APP />
  </StrictMode>
);
