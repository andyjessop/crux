import { reducerRegistry, middlewareRegistry } from './redux-registry';

describe('reduxRegistry', () => {
  it('should work', () => {
    expect(reducerRegistry()).toEqual('redux-registry');
  });
});
