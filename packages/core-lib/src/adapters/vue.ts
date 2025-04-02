import { ref, onMounted, onUnmounted, watch, Ref, inject, provide } from "vue";
import {
  MicroFrontendClient,
  createMicroFrontendClient,
  MicroFrontendClientConfig,
} from "../communication";

export const MicroFrontendSymbol = Symbol("MicroFrontend");

/**
 * Creates and provides a MicroFrontendClient instance
 * Call this in your main.ts file before mounting the app
 */
export function provideMicroFrontendClient(
  app: any,
  config: MicroFrontendClientConfig
): MicroFrontendClient {
  const client = createMicroFrontendClient(config);
  app.provide(MicroFrontendSymbol, client);
  return client;
}

/**
 * Gets the MicroFrontendClient instance
 * Use this in your components when you need direct access to the client
 */
export function useMicroFrontendClient(): MicroFrontendClient {
  const client = inject<MicroFrontendClient>(MicroFrontendSymbol);
  if (!client) {
    throw new Error(
      "MicroFrontendClient not found. Make sure to call provideMicroFrontendClient in your main.ts file."
    );
  }
  return client;
}

/**
 * Composable for route synchronization
 * Use this in your App.vue to sync routes with the host
 */
export function useVueRouteSync(
  getCurrentPath: () => string,
  navigateTo: (path: string) => void
) {
  const client = useMicroFrontendClient();
  const lastPath = ref<string>(getCurrentPath());

  onMounted(() => {
    const unsubscribe = client.onRouteChange((path) => {
      const currentPath = getCurrentPath();
      if (path !== currentPath) {
        console.log(
          `[Vue Route Sync] Navigating from ${currentPath} to ${path}`
        );
        navigateTo(path);
      }
    });

    onUnmounted(unsubscribe);
  });

  watch(
    getCurrentPath,
    (newPath) => {
      if (newPath !== lastPath.value) {
        console.log(`[Vue Route Sync] Notifying route change: ${newPath}`);
        client.notifyRouteChange(newPath);
        lastPath.value = newPath;
      }
    },
    { immediate: true }
  );
}

/**
 * Composable for bottom sheet mode
 * Use this to detect if your app is running in a bottom sheet
 */
export function useVueBottomSheetMode() {
  const client = useMicroFrontendClient();
  const isBottomSheet = ref(false);

  onMounted(() => {
    const unsubscribe = client.onBottomSheetMode((mode) => {
      isBottomSheet.value = mode;
    });

    onUnmounted(unsubscribe);
  });

  return isBottomSheet;
}

/**
 * Composable for opening apps in the bottom sheet
 * Use this to open other apps in the bottom sheet
 */
export function useBottomSheet() {
  const client = useMicroFrontendClient();

  const openApp = (
    appId: string,
    path: string = "/",
    height: string | number = "50vh"
  ) => {
    return client.openAppInBottomSheet(appId, path, height);
  };

  return { openApp };
}
