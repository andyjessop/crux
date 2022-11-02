import { html, render } from 'lit';
import type { TemplateResult } from 'lit';
import styles from './layout.module.scss';
import logo from '../assets/logo-transparent-small.png';
import { verticalDivider } from '../design/divider/vertical-divider';
import type { LayoutData } from './layout.index';

export function createLayoutView(root: HTMLElement) {
  return function renderLayout(data: LayoutData) {
    const { todos } = data;

    render(template(), root);

    function template() {
      let outlet: TemplateResult;

      if (todos) {
        outlet = html`<div class=${styles['main']} data-crux-root="todos"></div>`;
      }

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
        ${outlet}
        <div class=${styles['toaster']} data-crux-root="toaster"></div>
      `;
    }
  };
}
