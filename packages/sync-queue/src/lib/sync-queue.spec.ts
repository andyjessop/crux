import { syncQueue } from './sync-queue';

describe('syncQueue', () => {
  it('should work', () => {
    expect(syncQueue()).toEqual('sync-queue');
  });
});
