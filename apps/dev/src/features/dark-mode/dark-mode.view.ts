import { html, render } from "lit-html";
import { createRef, ref } from 'lit-html/directives/ref.js';

interface Actions {
  toggle(): void;
}

interface Data {
  isDark: boolean;
}

export function createDarkModeView(root: HTMLElement, data: Data, actions: Actions) {
  const { toggle } = actions;
  const { isDark } = data;

  const switchRef = createRef();

  render(html`
    <sl-switch ${ref(switchRef)} .checked=${isDark}>${isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</sl-switch>
  `, root);

  switchRef.value.addEventListener('sl-change', (data) => {
    toggle();
  });
}