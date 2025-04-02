import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { MicroFrontendProvider } from "../../core-lib/src/adapters/react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <MicroFrontendProvider guestId="app2" debug={true}>
        <App />
      </MicroFrontendProvider>
    </BrowserRouter>
  </React.StrictMode>
);
