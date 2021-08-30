import { createSyncQueue } from '@crux/utils';
import { observable, observe, raw, unobserve } from '@nx-js/observer-util';

type Callback<T> = (data: T) => void;
type Selector<T, U> = (state: T, ...args: unknown[]) => U;
type Unsubscribe = () => void;

export interface CruxStore<T> {
  getState(): T;
  pause(): void;
  resume(): void;
  subscribe<U extends unknown>(
    selector: Selector<T, U>,
    callback: Callback<U>,
  ): Unsubscribe;
  update(newState: Partial<T>): void;
  update(newState: unknown, path?: string): void;
}

/**
 * Create a store.
 */
export function createCruxStore<T extends Record<string, unknown>>(initialState: T): CruxStore<T> {
  let paused = false;
  const queue = createSyncQueue();
  const state = observable(initialState);

  return {
    getState,
    pause,
    resume,
    subscribe,
    update,
  };

  function getState() {
    return raw(state);
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

  /**
   * Add reactions to the queue if the store is paused. Otherwise, run the reaction.
  */
  function scheduler(reaction: () => void) {
    if (paused) {
      return queue.add(reaction);
    }

    return reaction();
  }

  /**
   * Observe a slice of the state.
   */
   function subscribe<U extends unknown>(
    selector: Selector<T, U>,
    callback: Callback<U>,
  ): Unsubscribe {
    const reaction = observe(() => {
      const slice = selector(state);

      callback(slice);
    }, { scheduler });

    return () => unobserve(reaction);
  }

  function update(newState: Partial<T>, path?: string): void {
    const target = getNestedProp(state, path);

    mergeDeep(target, newState);
  }
}

function isObject(item: unknown): boolean {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

function getNestedProp(obj: Record<string, unknown> | unknown, path?: string) {
  if (!path) {
    return obj;
  }

  const arr = path.split('.');

  while (arr.length && (obj = obj[arr.shift()]));

  return obj;
}

function mergeDeep<T>(target: T, ...sources: Partial<T>[]): Partial<T> {
  if (!sources.length) {
    return target;
  }
  
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, {
          [key]: {}
        });

        mergeDeep(target[key], <T[Extract<keyof T, string>]>source[key]);
      } else {
        Object.assign(target, {
          [key]: source[key]
        });
      }
    }
  }

  return mergeDeep(target, ...sources);
}