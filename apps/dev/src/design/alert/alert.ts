import { html } from "lit-html";
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { styleMap } from 'lit-html/directives/style-map.js';
import type { Alert } from "../../features/toaster/toaster.slice";
import alertStyles from './alert.module.scss';
import { cx } from "@crux/utils";

export function alert(
  { animationDuration, html: alertHTML, id, removing, text, variant }: Alert,
  close: (id: string) => void,
  className: string,
) {
  const fullClassName = cx(
    alertStyles['alert'],
    alertStyles[variant],
    className,
    'animate__animated',
    removing ? 'animate__fadeOutRight' : '',
  );

  const style = styleMap({
    '--animate-duration': `${(animationDuration ?? 0) / 1000}s`,
  });

  return html`
    <div
      class=${fullClassName}
      role="alert"
      style=${style}>
      ${alertHTML ? unsafeHTML(alertHTML) : text}
      <button @click=${() => close(id)}>x</button>
    </div>`;
}