import { LitElement, html, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './task.css?inline';
import cardStyles from '../../../../design/card/card.css?inline';
import { cx } from '@crux/utils';

export class TodoTask extends LitElement {
  static styles = [unsafeCSS(styles), unsafeCSS(cardStyles)];

  @property({ type: String })
  'created-at': string;

  @property({ type: String })
  'dragging-task-id': string;

  @property({ type: String })
  status: string;

  @property({ type: String })
  'task-id': string;

  @property({ type: String })
  text: string;

  render() {
    return html`<div
      class=${cx(
        this.className,
        'task',
        this.status,
        !this['dragging-task-id'] ? cardStyles['interactive'] : ''
      )}
    >
      <div class="title">${this.text}</div>
      <div class="subtitle">${this['created-at']}</div>
      <slot></slot>
    </div>`;
  }
}

customElements.define('todo-task', TodoTask);

declare global {
  interface HTMLElementTagNameMap {
    'todo-task': TodoTask;
  }
}
