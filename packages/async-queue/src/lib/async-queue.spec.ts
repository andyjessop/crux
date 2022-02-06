import { asyncQueue } from './async-queue';

describe('asyncQueue', () => {
  it('should work', () => {
    expect(asyncQueue()).toEqual('async-queue');
  });
});
