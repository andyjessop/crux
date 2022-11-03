import { LitElement, html, css, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './expanding-dropzone.css?inline';
import overlayStyles from '../task-overlay/task-overlay.css?inline';
import type { Status } from '../../domain/todos.types';

export class ExpandingDropzone extends LitElement {
  static styles = [unsafeCSS(styles)];

  @property({ type: String })
  status: Status;

  private _onEnter(status: Status) {
    this.dispatchEvent(
      new CustomEvent('status-overlay-enter', {
        detail: { status },
      })
    );
  }

  private _onExit(status: Status) {
    this.dispatchEvent(
      new CustomEvent('status-overlay-exit', {
        detail: { status },
      })
    );
  }

  render() {
    return html`<div
      @mouseenter=${() => this._onEnter(this.status)}
      @mouseleave=${() => this._onExit(this.status)}
      class="dropzone"
    >
      <div class="handle left"></div>
      <div class="handle right"></div>
    </div>`;
  }
}

customElements.define('expanding-dropzone', ExpandingDropzone);

declare global {
  interface HTMLElementTagNameMap {
    'expanding-dropzone': ExpandingDropzone;
  }
}
