import { createReduxRouter } from './redux-router';

describe('reduxRouter', () => {
  it('should work', () => {
    const router = createReduxRouter({
      users: '/users',
      user: '/users/:id',
    });

    expect(router.reducer).not.toBeUndefined();

    expect(router.api.navigate({ name: 'user', params: { id: '123' } })).not.toBeUndefined();
  });
});
