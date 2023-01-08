import { slice, view } from '@crux/crux';
import { createSelector } from 'reselect';
import { routerSlice } from '../shared/router/router.index';
import { layout } from './layout.selectors';

/**
 * Slice
 * =====
 */
export const layoutSlice = slice(
  () => import('./layout.slice').then((m) => m.createLayoutSlice('layout')),
  {
    name: 'layout',
  }
);

/**
 * Data
 * =========
 */
export type LayoutData = ReturnType<typeof data>;

export const data = createSelector([layoutSlice.selector, routerSlice.selector], layout);

/**
 * View
 * ====
 */
export const layoutView = view(() => import('./layout.view').then((m) => m.createLayoutView), {
  data,
  root: 'root',
});
