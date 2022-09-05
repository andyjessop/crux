import type ShoelaceElement from "@shoelace-style/shoelace/dist/internal/shoelace-element";
import { html, render } from "lit-html";
import { map } from 'lit-html/directives/map.js';
import { createRef, ref } from 'lit-html/directives/ref.js';
import type { SignupFormActions } from "./sign-up-form.service";
import type { SignupFormState } from "./sign-up-form.slice";

export function createSignupFormView(root: HTMLElement, data: SignupFormState, actions: SignupFormActions): void {
  const {
    email, password,
  } = data;

  const { onCancel, onChangeEmail, onChangePassword, onSubmit } = actions;

  if (email == undefined || password === undefined) {
    return null;
  }

  const dialogRef = createRef<ShoelaceElement>();
  const emailRef = createRef<HTMLInputElement>();
  const passwordRef = createRef<HTMLInputElement>();

  render(template(), root);

  function handleSubmit(event: Event) {
    event.preventDefault();

    onSubmit(emailRef.value?.value, passwordRef.value?.value)
  }

  dialogRef.value.addEventListener('sl-request-close', event => {
    onCancel();
  });

  function template() {
    return html`
    <sl-dialog
      ${ref(dialogRef)}
      label="Dialog"
      class="dialog-focus"
      open>
      <form @submit=${handleSubmit}>
        <sl-input
          ${ref(emailRef)}
          type="text"
          name="${email.name}"
          @input=${(e: Event) => onChangeEmail((e.target as HTMLInputElement).value)}
          .value="${email.value}"></sl-input>
        ${email.errorMessages.length && !email.isPristine
          ? html`${map(email.errorMessages, error => html`<div>${error}</div>`)}`
          : null
        }
        <sl-input
          ${ref(passwordRef)}
          type="password"
          name="${password.name}"
          @input=${(e: Event) => onChangePassword((e.target as HTMLInputElement).value)}
          .value="${password.value}"></sl-input>
        ${password.successMessage?.length && !password.isPristine
          ? html`<div>${password.successMessage}</div>`
          : null}
        <sl-button type="submit">Sign up</sl-button>
      </form>
    </sl-dialog>
    `;
  }
}