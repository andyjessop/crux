import { html, render } from "lit-html";
import { repeat } from 'lit/directives/repeat.js';
import type { NavItem, NavState } from "./nav.slice";
import navStyles from './nav.module.scss';
import type { RouterAPI } from "../../shared/router/router.service";
import type { NavData } from "./nav.index";
import { cx } from "@crux/utils";

export function navView(root: HTMLElement) {
  return function nav(data: NavData, actions: RouterAPI): void {
    const { items } = data;
    const { navigate } = actions;

    render(template(items), root);

    function template(items: NavItem[]) {
      const listItems = repeat(items, (item) => item.route, (item) =>
        html`
          <li class=${cx(
            navStyles['nav-item'],
            item.active && navStyles['active'],
          )}>
            <a href @click=${(e: Event) => navigate({ name: item.route }, e)}>${item.text}</a>
          </li>`
      );

      return html`
        <ul class=${navStyles['nav']}>
          ${listItems}
        </ul>`;
    }
  }
}