import { LitElement, html, css, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './task-overlay.css?inline';
import type { Status } from '../../domain/todos.types';
import { icon } from '../../../../design/icon/icon';

export class TaskOverlay extends LitElement {
  static styles = [unsafeCSS(styles)];

  @property({ type: Number })
  index: number;

  @property({ type: String })
  status: Status;

  @property({ type: String })
  placement: 'before' | 'after';

  private _onEnter(index: number, status: Status) {
    this.dispatchEvent(
      new CustomEvent('overlay-enter', {
        detail: { index, status },
      })
    );
  }

  private _onExit(index: number, status: Status) {
    this.dispatchEvent(
      new CustomEvent('overlay-exit', {
        detail: { index, status },
      })
    );
  }

  render() {
    const ndx = this.placement === 'before' ? this.index - 0.5 : this.index + 0.5;

    return html`<div
      @mouseenter=${() => this._onEnter(ndx, this.status)}
      @mouseleave=${() => this._onExit(ndx, this.status)}
      class=${this.placement}
    >
      <div class="handle left"></div>
      <div class="handle right"></div>
    </div>`;
  }
}

customElements.define('task-overlay', TaskOverlay);

declare global {
  interface HTMLElementTagNameMap {
    'task-overlay': TaskOverlay;
  }
}
