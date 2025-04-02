import React, {
  useEffect,
  useContext,
  createContext,
  useState,
  useRef,
  ReactNode,
} from "react";
import {
  MicroFrontendClient,
  createMicroFrontendClient,
  MicroFrontendClientConfig,
} from "../communication";

const MicroFrontendContext = createContext<MicroFrontendClient | null>(null);

export function useMicroFrontend() {
  const client = useContext(MicroFrontendContext);
  if (!client) {
    throw new Error(
      "useMicroFrontend must be used within a MicroFrontendProvider"
    );
  }
  return client;
}

interface MicroFrontendProviderProps extends MicroFrontendClientConfig {
  children: ReactNode;
}

export function MicroFrontendProvider({
  children,
  ...config
}: MicroFrontendProviderProps) {
  const clientRef = useRef<MicroFrontendClient | null>(null);

  if (!clientRef.current) {
    clientRef.current = createMicroFrontendClient(config);
  }

  return (
    <MicroFrontendContext.Provider value={clientRef.current}>
      {children}
    </MicroFrontendContext.Provider>
  );
}

export function useReactRouteSync(
  currentPath: string,
  navigate: (path: string) => void
) {
  const client = useMicroFrontend();
  const lastPathRef = useRef<string>(currentPath);

  // Listen for navigation requests from the host
  useEffect(() => {
    return client.onRouteChange((path) => {
      if (path !== currentPath) {
        navigate(path);
      }
    });
  }, [client, currentPath, navigate]);

  // Notify the host when the route changes
  useEffect(() => {
    if (currentPath !== lastPathRef.current) {
      client.notifyRouteChange(currentPath);
      lastPathRef.current = currentPath;
    }
  }, [client, currentPath]);
}

interface BottomSheetOpenerProps {
  appId: string;
  path?: string;
  height?: string | number;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function BottomSheetOpener({
  appId,
  path = "/",
  height = "50vh",
  children,
  className,
  style,
}: BottomSheetOpenerProps) {
  const client = useMicroFrontend();

  const handleClick = () => {
    client.openAppInBottomSheet(appId, path, height);
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
      {children || `Open ${appId}`}
    </button>
  );
}

export function useReactBottomSheetMode() {
  const client = useMicroFrontend();
  const [isBottomSheet, setIsBottomSheet] = useState(false);

  useEffect(() => {
    return client.onBottomSheetMode(setIsBottomSheet);
  }, [client]);

  return isBottomSheet;
}
