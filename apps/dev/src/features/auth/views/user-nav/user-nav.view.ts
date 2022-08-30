import { html, render } from "lit-html";
import type { AuthState } from "../../slice";
import type { AuthActions } from "./user-nav.selectors";

export function createUserNavView(root: HTMLElement, data: AuthState, actions: AuthActions) {
  const {
    user
  } = data;

  const { clickLogin, clickSignup } = actions;

  render(template(), root);

  function template() {
    return user
      ? html`<div>Logged in as ${user.email}</div>`
      : html`
        <button @click=${clickLogin}>Log in</button>
        <button @click=${clickSignup}>Sign up</button>
      `;
  }
}