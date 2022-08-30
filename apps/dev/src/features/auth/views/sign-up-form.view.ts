import { html, render } from "lit-html";
import { live } from 'lit-html/directives/live';
import { map } from 'lit-html/directives/map';
import type { SignupFormActions, SignupFormData } from "../domain/sign-up-form";

export function createSignUpFormView(root: HTMLElement, data: SignupFormData, actions: SignupFormActions) {
  const {
    email, password
  } = data;

  const { onChange, onSubmit } = actions;

  render(template(), root);

  function template() {
    return html`
      <form>
        <input
          type="text"
          name="${email.name}"
          placeholder="${email.placeholder}"
          @change=${(e: Event) => onChange(email.name, (e.target as HTMLInputElement).value)}
          .value=${live(email.value)}"
        />
        ${email.errorMessages.length && !email.isPristine
          ? html`${map(email.errorMessages, error => html`<div>${error}</div>`)}`
          : null
        }
        <input
          type="text"
          name="${password.name}"
          placeholder="${password.placeholder}"
          @change=${(e: Event) => onChange(password.name, (e.target as HTMLInputElement).value)}
          .value=${live(password.value)}"
        />
        ${password.errorMessages.length && !password.isPristine
          ? html`${map(password.errorMessages, error => html`<div>${error}</div>`)}`
          : null
        }
        <button @click=${onSubmit}>Submit</button>
      </form>
    `;
  }
}