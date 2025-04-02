import React from "react";
import { GuestManifest } from "../../../core-lib/src/types";
import { useBottomSheet } from "../context/BottomSheetContext";

interface BottomSheetButtonProps {
  guestApp: GuestManifest;
  path?: string;
  height?: string | number;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

const BottomSheetButton: React.FC<BottomSheetButtonProps> = ({
  guestApp,
  path = "/",
  height = "50vh",
  label,
  className,
  style,
}) => {
  const { openBottomSheet } = useBottomSheet();

  const handleClick = () => {
    openBottomSheet(guestApp, path, height);
  };

  return (
    <button
      onClick={handleClick}
      className={className}
      style={{
        padding: "8px 16px",
        backgroundColor: "#4a90e2",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        ...style,
      }}
    >
      {label || `Open ${guestApp.name}`}
    </button>
  );
};

export default BottomSheetButton;
