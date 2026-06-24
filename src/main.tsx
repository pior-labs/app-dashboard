import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@ipior/custom-tailwind-shadcn-themes";
import App from "./App";
import "./app.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider storageKey="homeserver-theme">
      <App />
    </ThemeProvider>
  </StrictMode>,
);
