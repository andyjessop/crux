import { cx } from '@crux/utils';
import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { Status } from '../../domain/todos.types';
import styles from './column.css?inline';

@customElement('todos-column')
export class TodosColumn extends LitElement {
  static styles = [unsafeCSS(styles)];

  @property({ type: String })
  status: Status;

  render() {
    return html`<div class=${cx(this.status, 'column')}>
      <slot></slot>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'todos-column': TodosColumn;
  }
}
