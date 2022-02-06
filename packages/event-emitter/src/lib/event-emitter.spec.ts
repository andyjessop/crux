import { eventEmitter } from './event-emitter';

describe('eventEmitter', () => {
  it('should work', () => {
    expect(eventEmitter()).toEqual('event-emitter');
  });
});
