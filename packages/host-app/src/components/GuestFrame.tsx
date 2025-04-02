import React, { useRef, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { GuestManifest } from "@microfrontend-iframe/core-lib/types";

interface GuestFrameProps {
  activeGuest: GuestManifest | null;
  guestPath: string;
}

const GuestFrame: React.FC<GuestFrameProps> = ({ activeGuest, guestPath }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentGuestId, setCurrentGuestId] = useState<string | null>(null);
  const [lastNavigatedPath, setLastNavigatedPath] = useState<string | null>(
    null
  );

  const baseIframeSrc = activeGuest ? activeGuest.entryUrl : undefined;

  useEffect(() => {
    if (activeGuest && activeGuest.id !== currentGuestId) {
      console.log(`Switching from app ${currentGuestId} to ${activeGuest.id}`);
      setCurrentGuestId(activeGuest.id);
      setIsLoading(true);
      setLastNavigatedPath(null);

      if (iframeRef.current) {
        iframeRef.current.src = baseIframeSrc!;
      }
    }
  }, [activeGuest?.id, baseIframeSrc, currentGuestId]);

  useEffect(() => {
    if (
      activeGuest &&
      !isLoading &&
      activeGuest.id === currentGuestId &&
      guestPath !== lastNavigatedPath &&
      iframeRef.current?.contentWindow
    ) {
      console.log(
        `Sending navigation message to ${activeGuest.id}: ${guestPath}`
      );

      iframeRef.current.contentWindow.postMessage(
        {
          type: "navigate",
          path: guestPath,
          id: uuidv4(),
        },
        baseIframeSrc!
      );

      setLastNavigatedPath(guestPath);
    }
  }, [
    activeGuest,
    guestPath,
    isLoading,
    currentGuestId,
    lastNavigatedPath,
    baseIframeSrc,
  ]);

  const handleIframeLoad = () => {
    console.log(`Iframe loaded for app: ${activeGuest?.id}`);
    setIsLoading(false);

    if (activeGuest && iframeRef.current?.contentWindow) {
      console.log(
        `Sending initial navigation to ${activeGuest.id}: ${guestPath}`
      );

      setTimeout(() => {
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage(
            {
              type: "navigate",
              path: guestPath,
              id: uuidv4(),
            },
            baseIframeSrc!
          );

          setLastNavigatedPath(guestPath);
        }
      }, 200);
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        activeGuest &&
        event.origin === new URL(activeGuest.entryUrl).origin
      ) {
        const message = event.data;

        if (message.type === "routeChange") {
          console.log(
            `Guest app ${activeGuest.id} changed route to: ${message.path}`
          );
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [activeGuest]);

  if (!activeGuest || !baseIframeSrc) {
    return <div>Select an application from the menu.</div>;
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
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
          Loading {activeGuest.name}...
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={baseIframeSrc}
        key={activeGuest.id}
        title={activeGuest.name}
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
  );
};

export default GuestFrame;
