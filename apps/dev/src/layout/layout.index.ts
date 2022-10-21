import { slice, view } from "@crux/xapp";

export const layoutSlice = slice(
  () => import('./layout.slice').then(m => m.createLayoutSlice('layout')),
  {
    name: 'layout'
  },
);

export const layoutView = view(
  () => import('./layout.view').then(m => m.createLayoutView),
  {
    data: layoutSlice.selector,
    root: 'root',
  },
);