import { html, render } from "lit-html";
import type { UserNavActions, UserNavData } from "./user-nav.selectors";

export function createUserNavView(root: HTMLElement, data: UserNavData, actions: UserNavActions) {
  const {
    user
  } = data;

  const { clickLogin, clickSignup } = actions;

  render(template(), root);

  function template() {
    return user
      ? html`<div>Logged in as ${user.email}</div>`
      : html`
        <sl-button @click=${clickLogin}>Log in</sl-button>
        <sl-button @click=${clickSignup}>Sign up</sl-button>
      `;
  }
}