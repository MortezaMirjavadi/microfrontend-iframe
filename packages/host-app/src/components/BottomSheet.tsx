import React, { useState, useEffect, useRef } from "react";
import { GuestManifest } from "../../../core-lib/src/types";
import { v4 as uuidv4 } from "uuid";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  guestApp: GuestManifest | null;
  initialPath?: string;
  height?: string | number;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  guestApp,
  initialPath = "/",
  height = "50vh",
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const iframeSrc = guestApp ? `${guestApp.entryUrl}${initialPath}` : undefined;

  const handleIframeLoad = () => {
    console.log(`Bottom sheet iframe loaded: ${iframeSrc}`);
    setIsLoading(false);

    if (guestApp && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: "bottomSheetMode",
          payload: {
            isBottomSheet: true,
            hostUrl: window.location.href,
            guestPath: initialPath,
          },
        },
        new URL(guestApp.entryUrl).origin
      );
    }
  };

  useEffect(() => {
    if (isOpen && guestApp) {
      setIsLoading(true);
    }
  }, [isOpen, guestApp, initialPath]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !guestApp) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: height,
        backgroundColor: "#fff",
        boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        transform: isOpen ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.3s ease-in-out",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          borderBottom: "1px solid #eee",
        }}
      >
        <h3 style={{ margin: 0 }}>{guestApp.name}</h3>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
          }}
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Loading indicator */}
        {isLoading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.8)",
              zIndex: 10,
            }}
          >
            Loading {guestApp.name}...
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={iframeSrc}
          key={`bottom-sheet-${guestApp.id}-${initialPath}-${uuidv4()}`}
          title={`${guestApp.name} (Bottom Sheet)`}
          onLoad={handleIframeLoad}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            opacity: isLoading ? 0.3 : 1,
            transition: "opacity 0.3s",
          }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    </div>
  );
};

export default BottomSheet;
