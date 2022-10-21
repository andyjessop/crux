import { render } from "lit-html";
import { repeat } from 'lit/directives/repeat.js';
import type { Alert, ToasterState } from "./toaster.slice";
import type { ToasterAPI } from "./toaster.service";
import toasterStyles from './toaster.module.scss';
import { alert } from '../../design/alert/alert';
import { cx } from "@crux/utils";

export function toasterView(root: HTMLElement) {
  return function toast(data: ToasterState, actions: ToasterAPI): void {
    const { alerts } = data;
    const { close } = actions;

    render(template(alerts), root);

    function template(toRender: Alert[]) {
      return repeat(toRender, (a: Alert) => a.id, (a: Alert) =>
        alert(a, close, cx(
          toasterStyles['alert'],
          ' animate__fadeInRight',
        )),
      );
    }
  }
}