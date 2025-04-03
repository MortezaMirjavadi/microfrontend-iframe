/**
 * Types for messages between host and guest apps
 */
export type MessageType =
  | "navigate" // Host → Guest: Request navigation
  | "routeChange" // Guest → Host: Report route change
  | "ready" // Guest → Host: App is ready
  | "handshake" // Host → Guest: Initial connection
  | "openBottomSheet" // Guest → Host: Open app in bottom sheet
  | "bottomSheetMode"; // Host → Guest: Notifies running in bottom sheet

export interface BaseMessage {
  type: MessageType;
  id?: string;
}

export interface NavigateMessage extends BaseMessage {
  type: "navigate";
  path: string;
  id: string;
}

export interface RouteChangeMessage extends BaseMessage {
  type: "routeChange";
  path: string;
  appId: string;
}

export interface ReadyMessage extends BaseMessage {
  type: "ready";
  guestId: string;
  currentPath: string;
}

export interface HandshakeMessage extends BaseMessage {
  type: "handshake";
  payload: {
    hostUrl: string;
    guestPath: string;
    guestId: string;
  };
}

export interface OpenBottomSheetMessage extends BaseMessage {
  type: "openBottomSheet";
  appId: string;
  path?: string;
  height?: string | number;
}

export interface BottomSheetModeMessage extends BaseMessage {
  type: "bottomSheetMode";
  payload: {
    isBottomSheet: boolean;
    hostUrl: string;
    guestPath: string;
  };
}

export type GuestToHostMessage =
  | RouteChangeMessage
  | ReadyMessage
  | OpenBottomSheetMessage;
export type HostToGuestMessage =
  | NavigateMessage
  | HandshakeMessage
  | BottomSheetModeMessage;

/**
 * Configuration for the MicroFrontend client
 */
export interface MicroFrontendClientConfig {
  guestId: string;
  hostOrigin?: string;
  debug?: boolean;
  devMode?: boolean;
}

/**
 * A class that handles communication between guest apps and the host
 */
export class MicroFrontendClient {
  private guestId: string;
  private hostOrigin: string;
  private debug: boolean;
  private isInIframe: boolean;
  private routeChangeCallbacks: Array<(path: string) => void> = [];
  private readyCallbacks: Array<() => void> = [];
  private bottomSheetModeCallbacks: Array<(isBottomSheet: boolean) => void> =
    [];
  private devMode: boolean;

  /**
   * Creates a new MicroFrontendClient instance
   */
  constructor(config: MicroFrontendClientConfig) {
    this.guestId = config.guestId;
    this.hostOrigin =
      config.hostOrigin ||
      (document.referrer
        ? new URL(document.referrer).origin
        : window.location.origin);
    this.debug = config.debug || false;
    this.isInIframe = window.parent !== window;
    this.devMode = config.devMode || false;

    this.log("Initializing MicroFrontendClient", { devMode: this.devMode });
    this.setupMessageListener();
    this.sendReadyMessage();
  }

  /**
   * Checks if the app is running in development mode
   * @returns True if the app is in development mode
   */
  isDevMode(): boolean {
    return this.devMode;
  }

  /**
   * Logs a message if debug is enabled
   */
  private log(...args: any[]): void {
    if (this.debug) {
      console.log(`[MicroFrontend:${this.guestId}]`, ...args);
    }
  }

  /**
   * Sets up the message listener for messages from the host
   */
  private setupMessageListener(): void {
    window.addEventListener("message", (event: MessageEvent) => {
      if (event.origin !== this.hostOrigin) {
        this.log(
          `Message ignored from unexpected origin: ${event.origin}, expected ${this.hostOrigin}`
        );
        return;
      }

      const message = event.data as HostToGuestMessage;
      this.log("Received message from host:", message);

      switch (message.type) {
        case "navigate":
          this.handleNavigateMessage(message);
          break;
        case "handshake":
          this.handleHandshakeMessage(message);
          break;
        case "bottomSheetMode":
          this.handleBottomSheetModeMessage(message);
          break;
        default:
          this.log("Unknown message type:", message);
      }
    });
  }

  /**
   * Handles a navigate message from the host
   */
  private handleNavigateMessage(message: NavigateMessage): void {
    this.log(`Received navigation request to: ${message.path}`);

    window.dispatchEvent(
      new CustomEvent("mf-navigate", {
        detail: { path: message.path, id: message.id },
      })
    );

    this.routeChangeCallbacks.forEach((callback) => {
      try {
        callback(message.path);
      } catch (error) {
        console.error("Error in route change callback:", error);
      }
    });
  }

  /**
   * Handles a handshake message from the host
   */
  private handleHandshakeMessage(message: HandshakeMessage): void {
    this.log("Received handshake:", message);

    this.sendReadyMessage(message.payload.guestPath);

    if (message.payload.guestPath) {
      this.handleNavigateMessage({
        type: "navigate",
        path: message.payload.guestPath,
        id: "handshake-nav",
      });
    }
  }

  /**
   * Handles a bottomSheetMode message from the host
   */
  private handleBottomSheetModeMessage(message: BottomSheetModeMessage): void {
    this.log("Bottom sheet mode:", message.payload.isBottomSheet);

    window.dispatchEvent(
      new CustomEvent("mf-bottomsheet", {
        detail: message.payload,
      })
    );

    this.bottomSheetModeCallbacks.forEach((callback) => {
      try {
        callback(message.payload.isBottomSheet);
      } catch (error) {
        console.error("Error in bottom sheet mode callback:", error);
      }
    });
  }

  /**
   * Sends a ready message to the host
   */
  private sendReadyMessage(currentPath?: string): void {
    if (!this.isInIframe) {
      this.log("Not in iframe, skipping ready message");
      return;
    }

    const path = currentPath || window.location.pathname;
    this.log(`Sending ready message, current path: ${path}`);

    window.parent.postMessage(
      {
        type: "ready",
        guestId: this.guestId,
        currentPath: path,
        devMode: this.devMode,
      } as ReadyMessage,
      this.hostOrigin
    );

    this.readyCallbacks.forEach((callback) => {
      try {
        callback();
      } catch (error) {
        console.error("Error in ready callback:", error);
      }
    });
  }

  /**
   * Notifies the host that the route has changed
   * @param path The new path
   */
  notifyRouteChange(path: string): void {
    if (!this.isInIframe) {
      this.log("Not in iframe, skipping route change notification");
      return;
    }

    this.log(`Sending route change notification: ${path}`);

    window.parent.postMessage(
      {
        type: "routeChange",
        path,
        appId: this.guestId,
      } as RouteChangeMessage,
      this.hostOrigin
    );
  }

  /**
   * Opens an app in the bottom sheet
   * @param appId The ID of the app to open
   * @param path The path to navigate to
   * @param height The height of the bottom sheet
   */
  openAppInBottomSheet(
    appId: string,
    path: string = "/",
    height: string | number = "50vh"
  ): boolean {
    if (!this.isInIframe) {
      this.log("Not in iframe, cannot open bottom sheet");
      return false;
    }

    this.log(`Requesting to open ${appId} in bottom sheet`);

    window.parent.postMessage(
      {
        type: "openBottomSheet",
        appId,
        path,
        height,
      } as OpenBottomSheetMessage,
      this.hostOrigin
    );

    return true;
  }

  /**
   * Registers a callback for route change events
   * @param callback The callback function
   */
  onRouteChange(callback: (path: string) => void): () => void {
    this.routeChangeCallbacks.push(callback);

    return () => {
      this.routeChangeCallbacks = this.routeChangeCallbacks.filter(
        (cb) => cb !== callback
      );
    };
  }

  /**
   * Registers a callback for when the app is ready
   * @param callback The callback function
   */
  onReady(callback: () => void): () => void {
    this.readyCallbacks.push(callback);

    return () => {
      this.readyCallbacks = this.readyCallbacks.filter((cb) => cb !== callback);
    };
  }

  /**
   * Registers a callback for bottom sheet mode changes
   * @param callback The callback function
   */
  onBottomSheetMode(callback: (isBottomSheet: boolean) => void): () => void {
    this.bottomSheetModeCallbacks.push(callback);

    return () => {
      this.bottomSheetModeCallbacks = this.bottomSheetModeCallbacks.filter(
        (cb) => cb !== callback
      );
    };
  }

  /**
   * Sets whether the app is in development mode
   * @param devMode Whether the app is in development mode
   */
  setDevMode(devMode: boolean): void {
    this.devMode = devMode;
    this.log(`Dev mode ${devMode ? "enabled" : "disabled"}`);
  }
}

export function createMicroFrontendClient(
  config: MicroFrontendClientConfig
): MicroFrontendClient {
  return new MicroFrontendClient(config);
}
