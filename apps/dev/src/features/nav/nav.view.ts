import { html, render } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import navStyles from './nav.module.scss';
import type { RouterAPI } from '../../shared/router/router.service';
import { cx } from '@crux/utils';
import type { NavItem } from './nav.types';
import { icon } from '../../design/icon/icon';

export function navView(root: HTMLElement) {
  return function nav(items: NavItem[], actions: RouterAPI): void {
    const { link } = actions;

    render(template(items), root);

    function template(items: NavItem[]) {
      const listItems = repeat(
        items,
        (item) => item.route,
        (item) =>
          html`<li class=${cx(navStyles['nav-item'], item.active && navStyles['active'])}>
            <a href="#" @click=${link({ name: item.route })}> ${icon(item.icon)} ${item.text}</a>
          </li>`
      );

      return html`<ul class=${navStyles['nav']}>
        ${listItems}
      </ul>`;
    }
  };
}
