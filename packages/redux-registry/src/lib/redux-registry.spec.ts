import { reduxRegistry } from './redux-registry';

describe('reduxRegistry', () => {
  it('should work', () => {
    expect(reduxRegistry()).toEqual('redux-registry');
  });
});
