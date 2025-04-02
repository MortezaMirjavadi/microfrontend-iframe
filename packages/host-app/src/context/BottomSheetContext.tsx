import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { GuestManifest } from "../../../core-lib/src/types";
import BottomSheet from "../components/BottomSheet";
import { useManifests } from "../hooks/useManifests";

interface BottomSheetContextType {
  openBottomSheet: (
    guestApp: GuestManifest,
    path?: string,
    height?: string | number
  ) => void;
  closeBottomSheet: () => void;
  isBottomSheetOpen: boolean;
  currentBottomSheetApp: GuestManifest | null;
}

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(
  undefined
);

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error("useBottomSheet must be used within a BottomSheetProvider");
  }
  return context;
};

interface BottomSheetProviderProps {
  children: ReactNode;
}

export const BottomSheetProvider: React.FC<BottomSheetProviderProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentApp, setCurrentApp] = useState<GuestManifest | null>(null);
  const [currentPath, setCurrentPath] = useState<string>("/");
  const [sheetHeight, setSheetHeight] = useState<string | number>("50vh");
  const { manifests } = useManifests();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;

      if (message.type === "openBottomSheet") {
        console.log("Host received openBottomSheet request:", message);

        const appToOpen = manifests.find((m) => m.id === message.appId);

        if (appToOpen) {
          openBottomSheet(
            appToOpen,
            message.path || "/",
            message.height || "50vh"
          );
        } else {
          console.warn(`App with ID ${message.appId} not found`);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [manifests]);

  const openBottomSheet = (
    guestApp: GuestManifest,
    path = "/",
    height = "50vh"
  ) => {
    setCurrentApp(guestApp);
    setCurrentPath(path);
    setSheetHeight(height);
    setIsOpen(true);
  };

  const closeBottomSheet = () => {
    setIsOpen(false);
  };

  return (
    <BottomSheetContext.Provider
      value={{
        openBottomSheet,
        closeBottomSheet,
        isBottomSheetOpen: isOpen,
        currentBottomSheetApp: currentApp,
      }}
    >
      {children}
      <BottomSheet
        isOpen={isOpen}
        onClose={closeBottomSheet}
        guestApp={currentApp}
        initialPath={currentPath}
        height={sheetHeight}
      />
    </BottomSheetContext.Provider>
  );
};
