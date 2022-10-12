import type { Selector, SelectorOrServiceTypes, Service } from "./types";

export type Subscription = ReturnType<typeof subscription>;

export function subscription<
  T extends (Selector | Service)[],
  Args extends SelectorOrServiceTypes<T>
>(
  factory: () => Promise<(...args: Args) => void>,
  { deps }: { deps: T }
) {
  type Instance = (...args: Args) => void;

  let instance: Instance | undefined;
  let promise: Promise<Instance> | undefined;
  const cachedDeps = [] as any;

  return {
    getInstance,
    instance,
    promise,
    runSubscription,
    updateDeps,
  };

  async function getInstance(): Promise<Instance> {
    if (instance) {
      return instance;
    }

    if (promise) {
      return promise;
    }

    promise = factory();

    promise.then(i => {
      instance = i;
    })

    return promise;
  }

  async function runSubscription(state: any) {
    if (!instance) {
      await getInstance();
    }

    if (!instance) {
      throw new Error('Could not get subscription instance');
    }

    if (!await updateDeps(state)) {
      return;
    }

    return instance(...cachedDeps);
  }

  async function updateDeps(state: any) {
    let isUpdated = false;

    for (const [i, dep] of deps.entries()) {
      if ((dep as Service).getAPI) {
        const api = await (dep as Service).getAPI();

        if (cachedDeps[i] === api) {
          continue;
        }

        cachedDeps[i] = api;

        isUpdated = true;
      } else {
        const value = await (dep as Selector)(state);

        if (cachedDeps[i] === value) {
          continue;
        }

        cachedDeps[i] = value;

        isUpdated = true;
      }
    }
    
    return isUpdated;
  }
}