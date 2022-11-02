import type { RouterState } from '../../shared/router/router.slice';
import type { NavItem } from './nav.types';

export function selectNavItems(routerState: RouterState): NavItem[] {
  const { route } = routerState;

  return [
    // {
    //   icon: 'stream',
    //   route: 'projects',
    //   text: 'Projects',
    //   active: route?.name === 'projects',
    // },
    {
      icon: 'tasks',
      route: 'todos',
      text: 'Todos',
      active: route?.name === 'todos',
    },
  ];
}
