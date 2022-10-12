import { DynamicStore } from "@crux/create-store";
import { Middleware, Reducer } from "@crux/redux-types";
import { generateRandomId } from "@crux/string-utils";
import type { SliceInstance, NodeTypes, Service, Slice } from "./types";

export function slice<
  State,
  T extends [] | Service<any>[],
  Args extends NodeTypes<T>,
  API = any
>(
  factory: (...args: Args) => Promise<SliceInstance<API>>,
  options: {
    deps?: T,
    shouldBeEnabled?: (state: State) => boolean,
    isGlobal?: boolean,
    name: string;
  } = {
    deps: [] as T,
    shouldBeEnabled: () => true,
    isGlobal: false,
    name: generateRandomId(),
  }
): Slice<API> {
  const { deps, shouldBeEnabled, isGlobal, name } = options;

  let instance: SliceInstance<API> | undefined;
  let instancePromise: Promise<SliceInstance<API>> | undefined;
  let store: DynamicStore | undefined;
  let unregister: (() => void) | undefined;

  return {
    bindStore,
    getInstance,
    getAPI,
    getStore,
    name,
    shouldBeEnabled,
    isGlobal: Boolean(isGlobal),
    getPromise: () => instancePromise,
    getUnregister: () => unregister,
    register,
    store,
  };

  function bindStore(newStore: DynamicStore) {
    store = newStore;
  }

  async function getInstance(): Promise<SliceInstance<API>> {
    if (!store) {
      throw new Error('Cannot get slice before binding store');
    }

    if (instance) {
      return instance;
    }

    if (instancePromise) {
      return instancePromise;
    }

    instancePromise = new Promise((resolve, reject) => {
      (Promise.all((deps || []).map(dep => dep.getAPI())) as Promise<Args>)
        .then(depAPIs => {

          const promise = factory(...depAPIs);
    
          promise.then(i => {
            instance = i;
      
            if ((i.middleware || i.reducer) && !unregister) {
              register(i.middleware, i.reducer);
            }

            resolve(instance);
          }).catch(e => {
            reject(e);
          });
        });
    });

    return instancePromise;
  }

  async function getAPI(): Promise<API> {
    const instance = await getInstance();

    return instance.api;
  }

  function getStore(): DynamicStore | undefined {
    return store;
  }

  function register(middleware?: Middleware, reducer?: Reducer) {
    if (!middleware || !reducer) {
      return;
    }

    if (!store) {
      throw new Error('Cannot get slice before binding store');
    }

    let removeMiddleware: () => void;
    let removeReducer: () => void;

    if (middleware) {
      removeMiddleware = store.addMiddleware(middleware);
    }

    if (reducer) {
      removeReducer = store.addReducer(name, reducer);
    }

    unregister = () => {
      removeReducer?.();
      removeMiddleware?.();
    }
  }
}