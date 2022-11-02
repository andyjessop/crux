import { LitElement, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import styles from './template.css?inline';

@customElement('my-element')
export class MyElement extends LitElement {
  static styles = [unsafeCSS(styles)];

  render() {
    return html`<div class="test">My Element</div>`;
  }
}
