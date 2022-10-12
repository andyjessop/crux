import { createStore } from './create-store';

describe('createStore', () => {
  it('should work', () => {
    expect(createStore()).toEqual('create-store');
  });
});
