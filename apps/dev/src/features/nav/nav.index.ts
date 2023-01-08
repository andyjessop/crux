import { view } from '@crux/crux';
import { createSelector } from 'reselect';
import { routerService, routerSlice } from '../../shared/router/router.index';
import { selectNavItems } from './nav.selectors';

export const navSelector = createSelector(routerSlice.selector, selectNavItems);

export const navView = view(() => import('./nav.view').then((m) => m.navView), {
  actions: routerService,
  data: navSelector,
  root: 'nav',
});
