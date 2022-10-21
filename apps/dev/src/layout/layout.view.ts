import { html, render } from 'lit-html';
import styles from './layout.module.scss';
import logo from '../assets/logo-code-transparent.png';
import { verticalDivider } from '../design/divider/vertical-divider';

export function createLayoutView(root: HTMLElement) {
  return function renderLayout() {
    render(template(), root);

    function template() {
      return html`
        <div class=${styles['top']}>
          <div class=${styles['logo']} data-crux-root="logo">
            <img src=${logo} alt="Crux Code" />
          </div>
          ${verticalDivider()}
          <div class=${styles['nav']} data-crux-root="nav"></div>
          <div class=${styles['right-nav']}>
            <div data-crux-root="dark-mode-toggle"></div>
          </div>
        </div>
        <div class=${styles['main']} data-crux-root="main"></div>
        <div class=${styles['toaster']} data-crux-root="toaster"></div>
      `;
    }
  }
}