import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

const app = createApp(App);
app.use(router);
app.mount("#app");

const hostOrigin = import.meta.env.VITE_HOST_ORIGIN || window.location.origin;

window.addEventListener("message", (event: MessageEvent) => {
  if (event.origin !== hostOrigin) {
    console.warn(`Message ignored from unexpected origin: ${event.origin}`);
    return;
  }

  const message = event.data;
  console.log("Vue Guest App 3 received message:", message);

  if (message.type === "bottomSheetMode") {
    console.log("Running in bottom sheet mode:", message.payload);
    window.dispatchEvent(
      new CustomEvent("bottomSheetMode", {
        detail: message.payload,
      })
    );
  } else if (message.type === "navigate") {
    console.log(`Vue App navigating to: ${message.path}`);
    window.dispatchEvent(
      new CustomEvent("appNavigation", {
        detail: { path: message.path, id: message.id },
      })
    );
  } else if (message.type === "handshake") {
    console.log(`Vue App received handshake:`, message.payload);

    const currentPath = router.currentRoute.value.path;
    window.parent.postMessage(
      {
        type: "ready",
        guestId: "app3",
        currentPath: currentPath,
      },
      hostOrigin
    );

    if (message.payload?.guestPath) {
      console.log(`Handshake included path: ${message.payload.guestPath}`);
      window.dispatchEvent(
        new CustomEvent("appNavigation", {
          detail: { path: message.payload.guestPath, id: "handshake-nav" },
        })
      );
    }
  }
});

setTimeout(() => {
  if (window.parent !== window) {
    const currentPath = router.currentRoute.value.path;
    console.log(
      `Vue App sending initial ready message, current path: ${currentPath}`
    );
    window.parent.postMessage(
      {
        type: "ready",
        guestId: "app3",
        currentPath: currentPath,
      },
      hostOrigin
    );
  }
}, 200);
