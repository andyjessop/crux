import type { RouterState } from '../../shared/router/router.slice';
import type { NavItem } from './nav.types';

export function selectNavItems(routerState: RouterState): NavItem[] {
  const { route } = routerState;

  return [
    {
      icon: 'tasks',
      route: 'todos',
      text: 'Todos',
      active: route?.name === 'todos',
    },
  ];
}
