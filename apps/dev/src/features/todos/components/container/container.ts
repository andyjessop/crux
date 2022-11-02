import { createDraggable } from '../../../../utils/draggable';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './container.css?inline';

@customElement('todos-container')
export class TodosContainer extends LitElement {
  static styles = [unsafeCSS(styles)];

  private destroyDraggable: () => void;

  @property({ type: String })
  'id-attribute' = '';

  @property({ type: String })
  'dragging-class' = 'dragging';

  @property({ type: String })
  'drag-selector' = '.task';

  _onDrag(id: string) {
    if (id) {
      const options = {
        detail: { id },
        bubbles: true,
        composed: true,
      };

      this.dispatchEvent(new CustomEvent('dragTask', options));
    }
  }

  _onDrop(id: string) {
    if (id) {
      const options = {
        detail: { id },
        bubbles: true,
        composed: true,
      };

      this.dispatchEvent(new CustomEvent('dropTask', options));
    }
  }

  connectedCallback() {
    super.connectedCallback();

    this.destroyDraggable = createDraggable({
      idAttribute: this['id-attribute'],
      draggingClass: this['dragging-class'],
      dragSelector: this['drag-selector'],
      onDrag: this._onDrag.bind(this),
      onDrop: this._onDrop.bind(this),
    });
  }

  disconnectedCallback(): void {
    this.destroyDraggable?.();
  }

  render() {
    return html`<div class="todos">
      <slot></slot>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'todos-container': TodosContainer;
  }
}
