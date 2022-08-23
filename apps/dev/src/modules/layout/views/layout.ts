import './normalise.css';
import { html, render } from 'lit-html';
import type { LayoutState } from '../types';
import styles from './layout.module.scss';

interface DefaultProps {
  root: HTMLElement;
}

interface Props extends DefaultProps {
  roots: LayoutState['roots'],
}

export function createLayoutView({ roots, root }: Props) {
  render(template(roots), root);

  function template(roots: LayoutState['roots']) {
    return html`
      <div class=${styles['app']}>
        <div class=${styles['left']} data-crux-root="top-left"></div>
        <div class=${styles['middle']} data-crux-root="top-middle"></div>
        <div class=${styles['right']} data-crux-root="top-right"></div>
      </div>
      <div class=${styles['controls']} data-crux-root="controls"></div>
      <div class=${styles['production']} data-crux-root="production"></div>
      <div class=${styles['staging']} data-crux-root="staging"></div>
      <div class=${styles['preview']} data-crux-root="preview"></div>
      <div class=${styles['releases']} data-crux-root="releases"></div>
      ${roots.sidebar
        ? html`<div class=${styles['sidebar']} data-crux-root="sidebar"></div>`
        : null}
    `;
  }
}