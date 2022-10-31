import { render } from 'lit';
import type { TemplateState } from './template.slice';
import type { TemplateAPI } from './template.service';

export function templateView(root: HTMLElement) {
  return function toast(data: TemplateState, actions: TemplateAPI): void {
    render(template(), root);

    function template() {}
  };
}
