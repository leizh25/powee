import { createSSRApp } from "vue";
import App from "./App.vue";
import * as Pinia from "pinia";
import "@/static/styles/index.scss";
import i18n from "./locale";
export function createApp() {
  const app = createSSRApp(App);
  app.use(Pinia.createPinia());
  app.use(i18n);
  return {
    app,
    Pinia,
  };
}
