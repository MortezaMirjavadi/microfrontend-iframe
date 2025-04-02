import React from "react";
import { useAppInBottomSheet } from "../hooks/useAppInBottomSheet";

const SomeComponent: React.FC = () => {
  const { openApp } = useAppInBottomSheet();

  const handleOpenAnalytics = () => {
    openApp("app3", "/dashboard", "60vh");
  };

  const handleOpenProducts = () => {
    openApp("app2", "/products", "70vh");
  };

  return (
    <div>
      <h2>Component Content</h2>
      <p>This is some content in a component.</p>

      <div>
        <button onClick={handleOpenAnalytics}>Open Analytics Dashboard</button>

        <button onClick={handleOpenProducts} style={{ marginLeft: "10px" }}>
          Open Product Catalog
        </button>
      </div>
    </div>
  );
};

export default SomeComponent;
