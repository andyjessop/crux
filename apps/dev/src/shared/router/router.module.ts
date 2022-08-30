import { createReduxRouter } from '@crux/redux-router';

export function createRouterModule() {
  return createReduxRouter({
    users: '/users',
    user: '/users/:id',
  });
}
