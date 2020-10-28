import { createEventEmitter } from '../event-emitter/event-emitter';
import { createQueue } from '../queue/queue';

export function createApp({
  layout, modules: initialModules, views: initialViews = {},
}: {
  layout: Layout;
  modules: any;
  views: any;
}) {
  const modules: any = { ...initialModules };
  const views: any = { ...initialViews };

  const emitter = createEventEmitter();
  const queue = createQueue();

  const state: any = Object.keys(modules)
    .reduce((acc, cur) => Object.assign(acc, { [cur]: modules[cur].initialState }), <any>{});

  return {
    ...emitter,
    dispatch,
  };

  function dispatch(module: string, action: string, data?: any) {
    queue.add(queuedDispatch, module, action, data);
    queue.flush();
  }

  async function queuedDispatch(module: string, action: string, data?: any) {
    // Handle the action in the primary module.
    const { event, state: newState } = modules[module].actions[action](data);

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

export interface Module<T extends object = {}, U extends Record<string, Function> = {}> {
  actions: U;
  initialState?: Partial<T>;
}