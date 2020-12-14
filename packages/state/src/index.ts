import { createQueue } from './queue';

/**
 * Create a store.
 */
export function createStore<T extends object>(initialState: T) {
  const state = { ...initialState };
  const queue = createQueue();
  let paused = false;
  const subscribers = [];

  return {
    pause,
    resume,
    state,
    subscribe,
    update,
  };

  /**
   * Observe a slice of the state.
   */
  function subscribe(selector, callback) {
    const newSubscriber = {
      callback,
      selector,
    };

    subscribers.push(newSubscriber);

    return function unsubscribe() {
      const index = subscribers.indexOf(
        (subscriber) => subscriber === newSubscriber,
      );

      if (index !== -1) {
        subscribers.splice(index, 1);
      }
    };
  }

  function notify() {
    subscribers.forEach((subscriber) => {
      const newValue = subscriber.selector(state);

      if (newValue !== subscriber.currentValue) {
        queue.add(subscriber.callback, newValue);

        subscriber.currentValue = newValue;
      }
    });

    if (!paused) {
      queue.flush();
    }
  }

  /**
   * Pause reactivity.
   */
  function pause() {
    paused = true;
  }

  /**
   * Resume reactivity.
   */
  function resume() {
    paused = false;

    queue.flush();
  }

  function update(callback: (state: T) => T) {
    Object.assign(state, callback(state));

    notify();
  }
}
