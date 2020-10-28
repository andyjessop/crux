import { createApp } from "./app/app";
import { createLayout } from "./layout/layout";
import { html } from 'lit-html';
import { createSidebar } from "./views/sidebar";

const appEl = document.getElementById('app');

if (!appEl) {
  throw Error('No app element found');
}

const root = {
  initialState: {
    first: false
  },
  showSidebar: function showSidebar(show = true) {
    return {
      state: { sidebar: show },
    }
  }
}

const app = createApp(
  { root },
  { sidebar: createSidebar() },
  createLayout(appEl, template),
);

app.dispatch('root/showSidebar');

setTimeout(() => {
  app.dispatch('root/showSidebar', false);
}, 3000);


function template(state: any) {
  return html`
    ${state.root.sidebar ? html`<div data-view-id="sidebar"></div>` : ''}
  `;
}