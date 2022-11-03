import type { Selector, SelectorOrServiceTypes, Service } from './types';

export type Subscription = ReturnType<typeof subscription>;

export function subscription<
  T extends [] | (Selector | Service)[],
  Args extends SelectorOrServiceTypes<T>
>(
  factory: (...args: Args) => void,
  options?: {
    deps: T;
    shouldBeEnabled?: (state: any) => boolean;
  }
) {
  const cachedDeps = [] as any;
  const { deps = [], shouldBeEnabled = () => true } = options ?? {};

  return {
    runSubscription,
    updateDeps,
  };

  async function runSubscription(state: any) {
    if (!shouldBeEnabled(state)) {
      return;
    }

    if (!(await updateDeps(state))) {
      return;
    }

    return factory(...cachedDeps);
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
