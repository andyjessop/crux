import { view } from '../../view';
import { selector } from './selector';

export type LayoutData = ReturnType<typeof layoutSelector>;

export const layoutSelector = selector;

export const layoutView = view(() => import('./view').then((mod) => mod.layout), {
  data: layoutSelector,
  root: 'root',
});
