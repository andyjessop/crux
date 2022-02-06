import { createSyncQueue } from '@crux/sync-queue';
import { observable, observe, raw, unobserve } from '@nx-js/observer-util';

type Callback<T> = (data: T) => void;
type Selector<T, U> = (state: T, ...args: unknown[]) => U;
type Unsubscribe = () => void;

export interface CruxStore<T> {
  getState(): T;
  middleware: Set<Middleware<T>>;
  pause(): void;
  resume(): void;
  subscribe<U>(
    selector: Selector<T, U>,
    callback: Callback<U>
  ): Unsubscribe;
  update(newState: Partial<T>): void;
  update(newState: unknown, path?: string): void;
}

export type MiddlewareCreator<T> = (getState: () => T) => Middleware<T>;
export type Middleware<T> = (newState: Partial<T>, path?: string) => void;

/**
 * Create a store.
 */
export function createCruxStore<T extends Record<string, unknown>>(
  initialState: T,
  middlewareCreators: MiddlewareCreator<T>[]
): CruxStore<T> {
  let paused = false;
  const queue = createSyncQueue();
  const state = observable(initialState);
  const middlewareSet = new Set<Middleware<T>>(
    middlewareCreators.map((middlewareCreator) => middlewareCreator(getState))
  );

  return {
    getState,
    middleware: middlewareSet,
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
  function subscribe<U>(
    selector: Selector<T, U>,
    callback: Callback<U>
  ): Unsubscribe {
    const reaction = observe(
      () => {
        const slice = selector(state);

        callback(slice);
      },
      { scheduler }
    );

    return () => unobserve(reaction);
  }

  function update(newState: Partial<T>, path?: string): void {
    const target = getNestedProp(state, path);

    mergeDeep(target, newState);

    if (middlewareSet.size > 0) {
      middlewareSet.forEach((middlewareFn) => {
        middlewareFn(newState, path);
      });
    }
  }
}

function isObject(item: unknown): item is Record<string, unknown> {
  return typeof item === 'object' && !Array.isArray(item);
}

function getNestedProp(obj: any, path?: string) {
  if (!path) {
    return obj;
  }

  const arr = path.split('.');

  if (!isObject(obj)) {
    return obj;
  }  

  while (arr.length && (obj = obj[<string>arr.shift()]));
  
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
        if (!target[key])
          Object.assign(target, {
            [key]: {},
          });

        mergeDeep(target[key], <T[Extract<keyof T, string>]>source[key]);
      } else {
        Object.assign(target, {
          [key]: source[key],
        });
      }
    }
  }

  return mergeDeep(target, ...sources);
}
