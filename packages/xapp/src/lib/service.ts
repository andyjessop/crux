import type { NodeTypes, Service } from "./types";

export function service<T extends [] | Service<any>[], Args extends NodeTypes<T>, I = any>(
  factory: (...args: Args) => Promise<I> | I,
  options: {
    deps: T,
  } = {
    deps: [] as T,
  }
): Service<I> {
  const { deps } = options;

  let instance: I | undefined;
  let promise: Promise<I> | undefined;

  return {
    getAPI: getInstance,
    getInstance,
    instance,
    promise,
  };

  async function getInstance(): Promise<I> {
    if (instance) {
      return instance;
    }

    if (promise) {
      return promise;
    }

    const depInstances = await Promise.all(deps.map(dep => dep.getAPI())) as Args;

    const ret = factory(...depInstances);

    if (ret instanceof Promise) {
      ret.then(i => {
        instance = i;
      })
  
      return ret;
    }

    instance = ret;

    return instance;
  }
}