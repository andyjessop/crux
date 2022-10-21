import { slice, view } from "@crux/xapp";
import { createSelector } from "reselect";
import { routerService, routerSlice } from "../../shared/router/router.index";

export const navSlice = slice(
  () => import('./nav.slice').then(m => m.createNavSlice('nav')),
  { name: 'nav' },
);

export type NavData = ReturnType<typeof navSelector>;

export const navSelector = createSelector(
  [routerSlice.selector],
  (routeState) => {
    const { route } = routeState;

    return {
      items: [
        {
          route: 'projects',
          text: 'Projects',
          active: route.name === 'projects',
        },
        {
          route: 'todos',
          text: 'Todos',
          active: route.name === 'todos',
        },
      ],
    };
  },
)

export const navView = view(
  () => import('./nav.view').then(m => m.navView),
  {
    actions: routerService,
    data: navSelector,
    root: 'nav',
  },
);