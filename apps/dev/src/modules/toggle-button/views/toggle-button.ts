import { html, render } from "lit-html";

interface DefaultProps {
  root: HTMLElement;
}

interface Props extends DefaultProps {
  status: string;
  toggle(): void;
}

export function createToggleButtonView(
  { status, toggle, root }: Props
) {
  render(html`<sl-button @click=${() => toggle()}>${status}</sl-button>`, root);
}