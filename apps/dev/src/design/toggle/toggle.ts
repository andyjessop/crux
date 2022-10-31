import { html } from 'lit';
import type { TemplateResult } from 'lit';
import toggleStyles from './toggle.module.scss';
import { cx } from '@crux/utils';

export function toggle({
  content,
  isOn,
  label,
  toggle: toggleHandler,
}: {
  content?: TemplateResult;
  isOn: boolean;
  label: string;
  toggle: () => void;
}) {
  return html`
    <button
      class=${toggleStyles['background']}
      type="button"
      role="switch"
      aria-label=${label}
      aria-checked=${isOn}
      @click=${toggleHandler}
    >
      <span class=${cx(toggleStyles['switch'], isOn && toggleStyles['on'])}></span>
      ${content}
    </button>
  `;
}
