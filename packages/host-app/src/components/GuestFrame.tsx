import React, { useRef, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { GuestManifest } from "@microfrontend-iframe/core-lib/types";
import { createDevProxy } from "@microfrontend-iframe/core-lib/proxy";

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

  const proxy = activeGuest?.proxy
    ? createDevProxy({
        prodUrl: activeGuest.entryUrl,
        proxy: activeGuest.proxy,
        debug: true,
      })
    : null;

  const baseUrl = proxy?.isEnabled()
    ? proxy.getDevUrl()
    : activeGuest?.entryUrl;

  const iframeSrc = baseUrl || undefined;

  useEffect(() => {
    if (activeGuest && activeGuest.id !== currentGuestId) {
      console.log(`Switching from app ${currentGuestId} to ${activeGuest.id}`);
      setCurrentGuestId(activeGuest.id);
      setIsLoading(true);
      setLastNavigatedPath(null);

      if (iframeRef.current) {
        iframeRef.current.src = iframeSrc!;
      }
    }
  }, [activeGuest?.id, iframeSrc, currentGuestId]);

  // Effect to handle navigation within the same app
  useEffect(() => {
    // Only send navigation message if:
    // 1. We have an active guest
    // 2. The iframe is already loaded
    // 3. We're not in the middle of switching apps
    // 4. The path has actually changed
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
        baseUrl!
      );

      setLastNavigatedPath(guestPath);
    }
  }, [
    activeGuest,
    guestPath,
    isLoading,
    currentGuestId,
    lastNavigatedPath,
    baseUrl,
  ]);

  const handleIframeLoad = () => {
    console.log(
      `Iframe loaded for app: ${activeGuest?.id} using ${proxy?.isEnabled() ? "DEV" : "PROD"} mode`
    );
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
            baseUrl!
          );

          setLastNavigatedPath(guestPath);
        }
      }, 200);
    }
  };

  if (!activeGuest || !iframeSrc) {
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

      {proxy?.isEnabled() && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "#ff9800",
            color: "white",
            padding: "5px 10px",
            borderRadius: "4px",
            fontSize: "12px",
            zIndex: 100,
          }}
        >
          DEV MODE
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={iframeSrc}
        key={`${activeGuest.id}-${proxy?.isEnabled() ? "dev" : "prod"}`}
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
