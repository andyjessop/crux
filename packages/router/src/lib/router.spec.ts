import { createRouter } from './router';

describe('router', () => {
  it('should work', () => {
    expect(createRouter({})).toEqual('router');
  });
});
