import { DynamicStore } from "@crux/create-store";
import { Middleware, Reducer } from "@crux/redux-types";
import { generateRandomId } from "@crux/string-utils";
import type { SliceInstance, NodeTypes, Service, Slice } from "./types";

export function slice<
  AppState,
  T extends [] | Service<any>[],
  Args extends NodeTypes<T>,
  State,
  API,
>(
  factory: (...args: Args) => Promise<SliceInstance<State, API>> | SliceInstance<State, API>,
  options: {
    deps?: T,
    shouldBeEnabled?: (state: AppState) => boolean,
    name: string;
  } = {
    deps: [] as T,
    shouldBeEnabled: () => true,
    name: generateRandomId(),
  }
) {
  const { deps, shouldBeEnabled, name } = options;

  let instance: SliceInstance<State, API> | undefined;
  let instancePromise: Promise<SliceInstance<State, API>> | undefined;
  let store: DynamicStore | undefined;
  let unregister: (() => void) | undefined;

  return {
    bindStore,
    getAPI,
    getInstance,
    getPromise: () => instancePromise,
    getStore,
    getUnregister: () => unregister,
    name,
    register,
    selector,
    shouldBeEnabled,
    store,
  } as Slice<State, API>;

  function bindStore(newStore: DynamicStore) {
    store = newStore;
  }

  async function getInstance(): Promise<SliceInstance<State, API>> {
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

          const ret = factory(...depAPIs);
    
          if (ret instanceof Promise) {
            ret.then(i => {
              instance = i;
        
              if ((i.middleware || i.reducer) && !unregister) {
                register(i.middleware, i.reducer);
              }
  
              resolve(instance);
            }).catch(e => {
              reject(e);
            });
          } else {
            instance = ret;
    
            if ((ret.middleware || ret.reducer) && !unregister) {
              register(ret.middleware, ret.reducer);
            }
    
            resolve(instance);
          }
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

  function register(middleware?: Middleware, reducer?: Reducer<State>) {
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

  function selector(state: any): State {
    return state[name] as State;
  }
}