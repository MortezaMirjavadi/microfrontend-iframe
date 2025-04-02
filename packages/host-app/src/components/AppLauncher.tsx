import React from "react";
import { GuestManifest } from "../../../core-lib/src/types";
import BottomSheetButton from "./BottomSheetButton";

interface AppLauncherProps {
  manifests: GuestManifest[];
}

const AppLauncher: React.FC<AppLauncherProps> = ({ manifests }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "10px",
        borderTop: "1px solid #eee",
        backgroundColor: "#f9f9f9",
      }}
    >
      <div style={{ marginRight: "10px" }}>Quick Access:</div>
      {manifests.map((app) => (
        <BottomSheetButton
          key={app.id}
          guestApp={app}
          path={app.menuItems[0]?.path || "/"}
          label={app.name}
          style={{ margin: "0 5px" }}
        />
      ))}
    </div>
  );
};

export default AppLauncher;
