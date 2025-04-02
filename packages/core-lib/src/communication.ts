import { AppMessage } from "./types";

const DEBUG = true;

export function sendMessageToGuest(
  iframeElement: HTMLIFrameElement | null,
  message: AppMessage,
  guestOrigin: string
) {
  if (DEBUG) console.log(`[HOST→GUEST] Sending to ${guestOrigin}:`, message);

  if (iframeElement?.contentWindow) {
    iframeElement.contentWindow.postMessage(message, guestOrigin);
  } else {
    console.warn("Cannot send message: iframe contentWindow not available.");
  }
}

export function sendMessageToHost(message: AppMessage, hostOrigin: string) {
  if (DEBUG) console.log(`[GUEST→HOST] Sending to ${hostOrigin}:`, message);

  if (window.parent && window.parent !== window) {
    window.parent.postMessage(message, hostOrigin);
  } else {
    console.warn(
      "Cannot send message: not running inside an iframe or parent is inaccessible."
    );
  }
}
