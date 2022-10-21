import { html } from "lit-html";
import type { TemplateResult } from "lit-html";
import toggleStyles from './toggle.module.scss';
import { cx } from "@crux/utils";

export function toggle({
  content, isOn, label, toggle: toggleHandler
}: {
  content?: TemplateResult, isOn: boolean, label: string, toggle: () => void
}  ) {
  return html`
    <button
      class=${toggleStyles['background']}
      type="button"
      role="switch"
      aria-label=${label}
      aria-checked=${isOn}
      @click=${toggleHandler}>
      <span class=${cx(
        toggleStyles['switch'],
        isOn && toggleStyles['on']
      )}>
      ${content}
    </button>
  `;
}
