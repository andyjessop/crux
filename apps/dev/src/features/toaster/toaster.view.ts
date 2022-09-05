import { html, render } from "lit-html";
import { map } from 'lit-html/directives/map.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import type { ToasterActions } from "./toaster.selectors";
import type { Alert, ToasterState } from "./toaster.slice";

export function createToastView(root: HTMLElement, data: ToasterState, actions: ToasterActions): void {
  const {
    alerts,
  } = data;

  const {
    toastAlert
  } = actions;

  render(template(alerts), root);

  for (const alert of alerts) {
    toastAlert(alert);
  }

  function template(toRender: Alert[]) {
    return map(toRender, (alert: Alert) => html`
      <sl-alert
        id=${alert.id}
        variant=${alert.variant}
        duration=${alert.duration}
        closable>
        <sl-icon
          slot="icon"
          name="info-circle"></sl-icon>
        ${unsafeHTML(alert.html)}
      </sl-alert>`
    );
  }
}