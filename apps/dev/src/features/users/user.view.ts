import { html, render } from "lit-html";

interface Data {
  email: string;
}

export function createUserView(root: HTMLElement, data: Data) {
  const { email } = data;
  
  render(html`<div>${email}</div>`, root);
}