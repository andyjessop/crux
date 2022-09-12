import './normalise.css';
import { html, render } from 'lit-html';
import type { LayoutState } from './types';
import styles from './layout.module.scss';
import type { LayoutData } from './layout.selectors';

interface DefaultProps {
  root: HTMLElement;
}

interface Props extends DefaultProps {
  roots: LayoutState['roots'],
}

export function createLayoutView(root: HTMLElement, data: LayoutData) {
  render(template(data.layout.roots), root);

  function template(roots: LayoutState['roots']) {
    return html`
      <div class=${styles['app']}>
        <div class=${styles['top']}>
          <div data-crux-root="top-left"></div>
          ${data.auth.machineState === 'signupForm'
            ? html`<div class=${styles['right']} data-crux-root="sign-up-form"></div>`
            : null}
          <div>
            <div data-crux-root="user-nav"></div>
            <div data-crux-root="dark-mode-toggle"></div>
          </div>
        </div>
        ${roots.sidebar
          ? html`<div class=${styles['sidebar']} data-crux-root="sidebar"></div>`
          : null}
        
        <div class=${styles['main']} data-crux-root="main"></div>
        <div data-crux-root="toast"></div>
      </div>
    `;
  }
}