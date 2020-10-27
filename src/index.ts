import { createEventEmitter } from './event-emitter';
import { createQueue } from './queue';

export function createModulesAPI<T, U, V>(
  initialModules: Partial<T> = {},
  initialViews: Partial<U> = {},
  layout: Layout<V>,
) {
  const modules: Partial<T> = { ...initialModules };
  const views: Partial<U> = { ...initialViews };

  const emitter = createEventEmitter();
  const queue = createQueue();
  const state = {};

  return {
    ...emitter,
    dispatch,
  };

  function dispatch(act: string, data: any) {
    queue.add(queuedDispatch, act, data);
  }

  async function queuedDispatch(act: string, data: any) {
    const [name, action] = act.split('/');

    // Handle the action in the primary module.
    const { event, state: newState } = modules[name][action](data);

    Object.assign(state[name], newState);

    const { mount, unmount } = layout.update(state);

    await Promise.all(unmount.map(viewId => views[viewId].unmount()));

    await Promise.all(mount.map(({ el, viewId }) => views[viewId].mount(el, state)));

    // Emit any event to listening modules and views.
    if (event) {
      emitter.emit(event.type, { data: event.data, state });
    }
  }
}

export interface Layout<T> {
  update(state: T): { mount: { el: HTMLElement, viewId: string }[], unmount: string[] }
}
