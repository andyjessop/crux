import { render } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import type { Alert, ToasterState } from './toaster.slice';
import type { ToasterService } from './toaster.service';
import toasterStyles from './toaster.module.scss';
import { alert } from '../../design/alert/alert';
import { cx } from '@crux/utils';

export function toasterView(root: HTMLElement) {
  return function toast(data: ToasterState, actions: ToasterService): void {
    const { alerts } = data;
    const { close } = actions;

    render(template(alerts), root);

    function template(toRender: Alert[]) {
      return repeat(
        toRender,
        (a: Alert) => a.id,
        (a: Alert) => alert(a, close, cx(toasterStyles['alert'], ' animate__fadeInRight'))
      );
    }
  };
}
