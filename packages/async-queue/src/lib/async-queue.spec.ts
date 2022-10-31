import { createAsyncQueue } from './async-queue';

describe('asyncQueue', () => {
  it('should work', () => {
    expect(createAsyncQueue()).toEqual('async-queue');
  });
});
