import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@pior-labs/design-system";
import App from "./App";
import "./app.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider storageKey="homeserver-theme">
      <App />
    </ThemeProvider>
  </StrictMode>,
);
