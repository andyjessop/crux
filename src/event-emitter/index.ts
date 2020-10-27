import type { EventEmitter } from './types';
type API = EventEmitter.API;
type Handler = EventEmitter.Handler;
type Listener = EventEmitter.Listener

/**
 * Create an event emitter.
 */
export function createEventEmitter(): API {
  const listeners: Listener[] = [];

  return {
    addListener,
    emit,
    removeListener,
  };

  /**
   * Subscribe to an event.
   */
  function addListener(type: string, handler: Handler): void {
    const listener = { handler, type };

    listeners.push(listener);
  }

  /**
   * Emit an event.
   */
  function emit(type: string, data: any): void {
    let listener: Listener;

    for (listener of listeners) {
      if (listener.type !== type) {
        continue;
      }

      listener.handler(data);
    }
  }

  /**
   * Remove a listener.
   */
  function removeListener(type: string, handler: Handler): void {
    const ndx = listeners.findIndex(
      (l: Listener) => type === l.type && handler === l.handler,
    );

    if (ndx !== -1) {
      listeners.splice(ndx, 1);
    }
  }
}