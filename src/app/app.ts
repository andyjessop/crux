import { createEventEmitter } from '../event-emitter/event-emitter';
import { createQueue } from '../queue/queue';

export function createApp(
  initialModules: any = {},
  initialViews: any = {},
  layout: Layout,
) {
  const modules: any = { ...initialModules };
  const views: any = { ...initialViews };

  const emitter = createEventEmitter();
  const queue = createQueue();
  const state: any = Object.keys(modules)
    .reduce((acc, cur) => {
      acc[cur] = modules[cur].initialState || {};

      return acc;
    }, <any>{})

  return {
    ...emitter,
    dispatch,
  };

  function dispatch(act: string, data?: any) {
    queue.add(queuedDispatch, act, data);
    queue.flush();
  }

  async function queuedDispatch(act: string, data?: any) {
    const [name, action] = act.split('/');

    // Handle the action in the primary module.
    const { event, state: newState } = modules[name][action](data);

    Object.assign(state[name], newState);

    const { mount, unmount } = layout.update(state);

    await Promise.all(unmount.map(({ el, viewId }) => views[viewId].unmount(el, state)));

    await Promise.all(mount.map(({ el, viewId }) => views[viewId].mount(el, state)));

    // Emit any event to listening modules and views.
    if (event) {
      emitter.emit(event.type, { data: event.data, state });
    }
  }
}

export interface Layout {
  update(state: any): Update;
}

export type Update = { mount: { el: Element, viewId: string }[], unmount: { el: Element, viewId: string }[] }