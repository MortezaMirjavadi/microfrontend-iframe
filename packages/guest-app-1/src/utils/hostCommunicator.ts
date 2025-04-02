import { sendMessageToHost as sendMessage } from "@microfrontend-iframe/core-lib/communication";
import { GuestToHostMessage } from "@microfrontend-iframe/core-lib/types";

export function sendMessageToHost(message: GuestToHostMessage) {
  const hostOrigin = import.meta.env.VITE_HOST_ORIGIN || window.location.origin;
  sendMessage(message, hostOrigin);
}
