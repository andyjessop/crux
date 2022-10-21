import { html } from 'lit-html';
import styles from './vertical-divider.module.scss';

export function verticalDivider() {
  return html`
    <div class=${styles['divider']}></div>
  `;
}