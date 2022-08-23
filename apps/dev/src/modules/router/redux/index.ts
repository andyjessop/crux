import { createReduxRouter } from '@crux/redux-router'

export function createRouterRedux() {
  return createReduxRouter({
    users: '/users',
    user: '/users/:id',
  });
}