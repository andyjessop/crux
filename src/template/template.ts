import { html } from 'lit-html';

export function createTemplate(state: any) {
  return html`
    ${state.root.sidebar ? html`<div data-view-id="sidebar"></div>` : ''}
  `;
}