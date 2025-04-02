import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

const hostOrigin = import.meta.env.VITE_HOST_ORIGIN || window.location.origin;

window.addEventListener("message", (event: MessageEvent) => {
  if (event.origin !== hostOrigin) {
    console.warn(`Message ignored from unexpected origin: ${event.origin}`);
    return;
  }

  const message = event.data;
  console.log("Guest App 2 received message:", message);

  if (message.type === "navigate") {
    console.log(`Guest App 2 navigating to: ${message.path}`);
    window.dispatchEvent(
      new CustomEvent("appNavigation", {
        detail: { path: message.path, id: message.id },
      })
    );
  }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
