import { slice, view } from "@crux/xapp";
import { selectData } from "./toaster.selectors";

export const toasterSlice = slice(() => import('./toaster.slice').then(m => m.createToasterSlice('toast')));

export const toasterView = view(
  () => import('./toaster.view').then(m => m.toasterView),
  {
    actions: toasterSlice,
    data: selectData,
    root: 'toaster'
  },
);