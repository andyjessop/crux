import { html } from 'lit';

const icons = {
  bell: 'las la-bell',
  'check-circle': 'las la-check-circle',
  mountain: 'las la-mountain',
  plus: 'las la-plus',
  'shipping-fast': 'las la-shipping-fast',
  stream: 'las la-stream',
  tasks: 'las la-tasks',
  user: 'las la-user',
} as Record<string, string>;

export function icon(type: string) {
  return html`<i class="${icons[type]}"></i>`;
}
