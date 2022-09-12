import type ShoelaceElement from "@shoelace-style/shoelace/dist/internal/shoelace-element";
import { html, render } from "lit-html";
import { map } from 'lit-html/directives/map.js';
import { createRef, ref } from 'lit-html/directives/ref.js';
import type { SignupFormAPI, SignupFormState } from "./sign-up-form.slice";

export function createSignupFormView(root: HTMLElement, data: SignupFormState, actions: SignupFormAPI): void {
  const {
    email, password, formState,
  } = data;

  const { onChange, onSubmit, reset } = actions;

  if (email == undefined || password === undefined) {
    return null;
  }

  const dialogRef = createRef<ShoelaceElement>();
  const emailRef = createRef<HTMLInputElement>();
  const passwordRef = createRef<HTMLInputElement>();

  render(template(), root);

  function handleSubmit(event: Event) {
    event.preventDefault();

    onSubmit({ email: emailRef.value?.value, password: passwordRef.value?.value });
  }

  dialogRef.value.addEventListener('sl-request-close', event => {
    reset();
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
          @input=${(e: Event) => onChange({ field: email.name, value: (e.target as HTMLInputElement).value })}
          .value="${email.value}"></sl-input>
        ${email.errors.length && !email.isPristine
          ? html`${map(email.errors, error => html`<div>${error}</div>`)}`
          : null
        }
        <sl-input
          ${ref(passwordRef)}
          type="password"
          name="${password.name}"
          @input=${(e: Event) => onChange({ field: password.name, value: (e.target as HTMLInputElement).value })}
          .value="${password.value}"></sl-input>
        ${password.messages?.length && !password.isPristine
          ? html`<div>${password.messages}</div>`
          : null}
        <sl-button
          .disabled=${formState === 'submitting'}
          type="submit">
          ${formState === 'submitting' ? 'Signing up...' :  'Sign up'}
        </sl-button>
      </form>
    </sl-dialog>
    `;
  }
}