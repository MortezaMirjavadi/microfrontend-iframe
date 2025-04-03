import React, { useState, useEffect } from "react";
import { GuestManifest } from "@microfrontend-iframe/core-lib/types";

interface DevModeToggleProps {
  manifests: GuestManifest[];
  onToggle: (appId: string, enabled: boolean) => void;
}

const DevModeToggle: React.FC<DevModeToggleProps> = ({
  manifests,
  onToggle,
}) => {
  const [devModes, setDevModes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const initialModes: Record<string, boolean> = {};
    manifests.forEach((manifest) => {
      if (manifest.proxy) {
        initialModes[manifest.id] = manifest.proxy.enabled;
      }
    });
    setDevModes(initialModes);
  }, [manifests]);

  const handleToggle = (appId: string) => {
    const newEnabled = !devModes[appId];
    setDevModes((prev) => ({ ...prev, [appId]: newEnabled }));
    onToggle(appId, newEnabled);
  };

  const appsWithProxy = manifests.filter((app) => app.proxy);

  if (appsWithProxy.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "10px",
        left: "10px",
        background: "#333",
        color: "white",
        padding: "10px",
        borderRadius: "4px",
        fontSize: "14px",
        zIndex: 1000,
      }}
    >
      <h3 style={{ margin: "0 0 10px 0" }}>Development Mode</h3>
      {appsWithProxy.map((app) => (
        <div key={app.id} style={{ marginBottom: "5px" }}>
          <label style={{ display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              checked={!!devModes[app.id]}
              onChange={() => handleToggle(app.id)}
              style={{ marginRight: "5px" }}
            />
            {app.name} ({app.proxy?.devServerUrl})
          </label>
        </div>
      ))}
      <div style={{ marginTop: "10px", fontSize: "12px", opacity: 0.7 }}>
        Changes will apply on next app load
      </div>
    </div>
  );
};

export default DevModeToggle;
