import { service, slice, view } from '@crux/xapp';

export const templateSlice = slice(
  () => import('./template.slice').then((m) => m.createTemplateSlice('template')),
  { name: 'template' }
);

export const templateService = service(
  (api) => import('./template.service').then((m) => m.template(api)),
  { deps: [templateSlice] }
);

export const templateView = view(() => import('./template.view').then((m) => m.templateView), {
  actions: templateService,
  data: templateSlice.selector,
  root: 'template',
});
