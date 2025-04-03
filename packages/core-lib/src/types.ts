export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
}

export interface ProxyConfig {
  enabled: boolean;
  devServerUrl: string;
  pathRewrite?: Record<string, string>;
  headers?: Record<string, string>;
}

export interface GuestManifest {
  id: string;
  name: string;
  description: string;
  version: string;
  entryUrl: string;
  routeRegex: string;
  menuItems: MenuItem[];
  bottomSheetRoutes?: BottomSheetRoute[];
  proxy?: ProxyConfig;
}

export interface BottomSheetRoute {
  id: string;
  label: string;
  path: string;
  description?: string;
}

export interface NavigateMessage {
  type: "navigate";
  path: string;
}

export interface RouteChangeMessage {
  type: "routeChange";
  path: string;
}

export interface HandshakeMessage {
  type: "handshake";
  payload?: any;
}

export type AppMessage = HostToGuestMessage | GuestToHostMessage;

export interface NavigateMessage {
  type: "navigate";
  path: string;
  id: string;
}

export interface RouteChangeMessage {
  type: "routeChange";
  path: string;
  id: string;
}

export interface ReadyMessage {
  type: "ready";
  guestId: string;
  currentPath: string;
}

export interface HandshakeMessage {
  type: "handshake";
  payload?: any;
}

export type HostToGuestMessage = NavigateMessage | HandshakeMessage;
export type GuestToHostMessage =
  | RouteChangeMessage
  | ReadyMessage
  | HandshakeMessage;
