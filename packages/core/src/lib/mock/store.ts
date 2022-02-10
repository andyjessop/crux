export interface Store<T> {
  getState(): T;
  pause(): boolean;
  resume(): boolean;
  subscribe(callback: () => void): () => boolean;
}

export function createMockStore<T>(state: T): Store<T> {
  const subscriptions = new Set<() => void>();

  return {
    getState,
    pause,
    resume,
    subscribe,
  }

  function getState() {
    return state;
  }

  function pause() {
    return true;
  }

  function resume() {
    return true;
  }

  function subscribe(callback: () => void) {
    subscriptions.add(callback);

    return function unsubscribe() {
      subscriptions.delete(callback);

      return true;
    }
  }
}