import { service, slice, view } from '@crux/crux';

export const toasterSlice = slice(
  () => import('./toaster.slice').then((m) => m.createToasterSlice('toaster')),
  { name: 'toaster' }
);

export const toasterService = service(
  (api) => import('./toaster.service').then((m) => m.toaster(api)),
  { deps: [toasterSlice] }
);

export const toasterView = view(() => import('./toaster.view').then((m) => m.toasterView), {
  actions: toasterService,
  data: toasterSlice.selector,
  root: 'toaster',
});
