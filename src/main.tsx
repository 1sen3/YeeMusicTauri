import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./components/providers/theme-provider";
import { MaterialProvider } from "./components/providers/material-provider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system">
      <MaterialProvider defaultMaterial="Mica">
        <App />
      </MaterialProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
