import { html, render } from "lit-html";

interface Actions {
  toggle(): void;
}

interface Data {
  isDark: boolean;
}

export function createToggleButtonView(root: HTMLElement, data: Data, actions: Actions) {
  const { toggle } = actions;
  const { isDark } = data;

  render(html`<button @click=${() => toggle()}>${isDark ? 'Light Mode' : 'Dark Mode'}</button>`, root);
}