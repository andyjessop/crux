import { dynamicStore } from './dynamic-store';

describe('dynamicStore', () => {
  it('should work', () => {
    expect(dynamicStore()).toEqual('dynamic-store');
  });
});
