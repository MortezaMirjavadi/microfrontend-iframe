import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { provideMicroFrontendClient } from "../../core-lib/src/adapters/vue";
import BottomSheetOpener from "../../core-lib/src/adapters/vue-components/BottomSheetOpener.vue";

import "./assets/main.css";

const app = createApp(App);
app.use(router);

app.component("BottomSheetOpener", BottomSheetOpener);

const client = provideMicroFrontendClient(app, {
  guestId: "app3",
  debug: true,
});

console.log("MicroFrontendClient created:", client);

app.mount("#app");

(window as any).__mfClient = client;
