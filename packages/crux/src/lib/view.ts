import type { Selector, Service, Slice, View, ViewInstance } from './types';

export function view<S, D, A>(
  factory: () => Promise<ViewInstance<D, A>> | ViewInstance<D, A>,
  options: {
    actions?: Service<A> | Slice<any, A>;
    data: Selector<S, D>;
    root: string;
  }
): View<D, A> {
  const { actions, data, root } = options;

  let currentData: D | undefined;
  let instance: ViewInstance<D, A> | undefined;
  let promise: Promise<ViewInstance<D, A>> | undefined;
  let renderFn: ((data: D, actions: A) => void) | undefined;
  let renderedTo: HTMLElement | undefined;

  return {
    get,
    getCurrentData: () => currentData,
    instance,
    promise,
    render,
    root,
    updateData,
  };

  async function get(): Promise<ViewInstance<D, A>> {
    if (instance) {
      return instance;
    }

    if (promise) {
      return promise;
    }

    const ret = factory();

    if (ret instanceof Promise) {
      ret.then((i) => {
        instance = i;
      });

      return ret;
    }

    instance = ret;

    return instance;
  }

  function updateData(state: any) {
    const newData = data(state);

    if (newData !== currentData) {
      currentData = newData;

      return true;
    }

    return false;
  }

  async function render(root: HTMLElement, state: any) {
    if (!instance) {
      await get();
    }

    if (!instance) {
      throw new Error('Could not get view instance');
    }

    // Return if the data hasn't changed and we've already rendered to this root
    if (!updateData(state) && root?.childElementCount) {
      return;
    }

    const actionsAPI = actions ? await actions.getAPI() : undefined;

    if (renderedTo === root && renderFn) {
      return renderFn(currentData as D, actionsAPI as A);
    }

    renderFn = instance(root);
    renderedTo = root;

    return renderFn(currentData as D, actionsAPI as A);
  }
}
