import { createReduxRouter } from '@crux/redux-router';

export const { Link, middleware, reducer } = createReduxRouter({
  users: '/users',
  user: '/users/:id',
});