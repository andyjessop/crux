import { html, render } from "lit-html";
import { map } from 'lit-html/directives/map.js';
import type { SignupFormActions } from "./sign-up-form.service";
import type { SignupFormState } from "./sign-up-form.slice";

export function createSignupFormView(root: HTMLElement, data: SignupFormState, actions: SignupFormActions): void {
  const {
    email, password, emailValue
  } = data;

  const { onChangeEmail, onChangePassword, onSubmit } = actions;

  if (email == undefined || password === undefined) {
    return null;
  }

  render(template(), root);

  function onClick() {
    try {
      const emailInputValue = (document.getElementById('sign-up-form-email') as HTMLInputElement).value;
      const passwordInputValue = (document.getElementById('sign-up-form-password') as HTMLInputElement).value;

      onSubmit(emailInputValue, passwordInputValue)
    } catch (e) {}
  }

  function template() {
    return html`
      <form>
        <input
          id="sign-up-form-email"
          type="text"
          name="${email.name}"
          @input=${(e: Event) => onChangeEmail((e.target as HTMLInputElement).value)}
          .value="${emailValue}">
        ${email.errorMessages.length && !email.isPristine
          ? html`${map(email.errorMessages, error => html`<div>${error}</div>`)}`
          : null
        }
        <input
          id="sign-up-form-password"
          type="password"
          name="${password.name}"
          @input=${(e: Event) => onChangePassword((e.target as HTMLInputElement).value)}
          .value="${password.value}">
        ${password.successMessage?.length && !password.isPristine
          ? html`<div>${password.successMessage}</div>`
          : null}
        <button @click=${onClick}>Submit</button>
      </form>
    `;
  }
}