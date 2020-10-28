import { createApp } from "./lib/app/app";
import { createLayout } from "./lib/layout/lit-html.layout";
import { createSidebarView } from "./views/sidebar.view";
import { createRootModule } from "./modules/root/root.module";
import { createTemplate } from "./template/template";

const appEl = document.getElementById('app');

if (!appEl) {
  throw Error('No app element found');
}

const app = createApp({
  layout: createLayout(appEl, createTemplate),
  modules:  { root: createRootModule() },
  views: { sidebar: createSidebarView() },
});

app.dispatch('root', 'showSidebar');

setTimeout(() => {
  app.dispatch('root', 'showSidebar', false);
}, 3000);