export interface MenuItem {
  label: string;
  path: string;
  icon?: string;
}

export interface GuestManifest {
  id: string;
  name: string;
  entryUrl: string;
  routeRegex: string;
  menuItems: MenuItem[];
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
