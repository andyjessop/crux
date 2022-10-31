import type { RouterState } from '../shared/router/router.slice';
import type { LayoutState } from './layout.slice';

export function layout(layoutState: LayoutState, router: RouterState) {
  return {
    ...layoutState,
    todos: router?.route?.name === 'todos',
  };
}
