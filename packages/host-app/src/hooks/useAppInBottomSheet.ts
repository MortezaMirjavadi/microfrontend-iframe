import { useBottomSheet } from "../context/BottomSheetContext";
import { useManifests } from "./useManifests";

export const useAppInBottomSheet = () => {
  const {
    openBottomSheet,
    closeBottomSheet,
    isBottomSheetOpen,
    currentBottomSheetApp,
  } = useBottomSheet();
  const { manifests } = useManifests();

  const openAppById = (appId: string, path = "/", height = "50vh") => {
    const app = manifests.find((m) => m.id === appId);
    if (app) {
      openBottomSheet(app, path, height);
      return true;
    }
    return false;
  };

  return {
    openApp: openAppById,
    closeBottomSheet,
    isBottomSheetOpen,
    currentBottomSheetApp,
  };
};
