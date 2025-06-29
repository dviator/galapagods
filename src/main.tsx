// src/main.tsx
import { createRoot } from "react-dom/client";
import "./main.css";
import { PhaseProvider } from "./contexts/phase";
import App from "./App";

const root = createRoot(document.getElementById("root")!);
root.render(
  <PhaseProvider>
    <App />
  </PhaseProvider>
);