import { createEventEmitter } from './event-emitter';

describe('eventEmitter', () => {
  it('should work', () => {
    expect(createEventEmitter).not.toBeUndefined();
  });
});
