export interface EventEmitter<T extends Record<string, unknown>> {
  emit<K extends keyof T>(type: K, data: T[K]): Promise<unknown[]>;
  on<K extends keyof T>(type: K, handler: EventHandler<T[K]>): void;
  once<K extends keyof T>(type: K, handler: EventHandler<T[K]>): void
  off<K extends keyof T>(type: K, handler: EventHandler<T[K]>): void;
}

export type EventHandler<T> = (data: T) => unknown;

export interface EventListener<T, K extends keyof T> {
  handler: EventHandler<T[K]>;
  type: K;
}

/**
 * Create an event emitter.
 */
export function createEventEmitter<T extends Record<string, unknown>>(): EventEmitter<T> {
  const listeners: EventListener<T, keyof T>[] = [];

  return {
    emit,
    on,
    once,
    off,
  };

  /**
   * Subscribe to an event.
   */
  function on<K extends keyof T>(type: K, handler: EventHandler<T[K]>): void {
    const listener = <EventListener<T, K>>{ handler, type };

    listeners.push(listener);
  }

  /**
   * Emit an event.
   */
  function emit<K extends keyof T>(type: K, data: T[K]): Promise<unknown[]> {
    let listener: EventListener<T, keyof T> | undefined;
    const promises: Promise<unknown>[] = [];

    for (listener of listeners) {
      if (listener.type !== type) {
        continue;
      }

      const result = listener.handler(data);

      if ((<Promise<unknown>>result)?.then) {
        promises.push(<Promise<unknown>>result);
      }
    }

    return Promise.all(promises);
  }

  /**
   * Remove a listener.
   */
  function off<K extends keyof T>(type: K, handler: EventHandler<T[K]>): void {
    const ndx = listeners.findIndex((l: EventListener<T, K>) => type === l.type && handler === l.handler);

    if (ndx !== -1) {
      listeners.splice(ndx, 1);
    }
  }

  /**
   * Subscribe to an event.
   */
   function once<K extends keyof T>(type: K, handler: EventHandler<T[K]>): void {
    const listener: EventListener<T, K> = {
      handler: (...args) => {
        off(type, handler);
        handler(...args);
      },
      type,
    };

    listeners.push(listener);
  }
}
