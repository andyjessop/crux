import { createReduxRouter } from '@crux/redux-router';

export const { middleware, reducer } = createReduxRouter({
  users: '/users',
  user: '/users/:id',
});