import { createEventEmitter } from '../event-emitter/event-emitter';
import { createQueue } from '../queue/queue';
import { Router } from '../router/router/types';

export function createApp({
  layout, modules: initialModules, views: initialViews = {}, router,
}: {
  layout: Layout;
  modules: any;
  router: Router.API;
  views: any;
}) {
  const modules: any = { ...initialModules };
  const views: any = { ...initialViews };

  const emitter = createEventEmitter();
  const queue = createQueue();
  const mounts = createMounts();

  router.addListener(Router.Events.Transition, () => dispatch());

  return {
    ...emitter,
    dispatch,
    router,
  };

  function dispatch(module?: string, action?: string, data?: any) {
    queue.add(queuedDispatch, module, action, data);
    queue.flush();
  }

  async function queuedDispatch(module?: string, action?: string, data?: any) {
    // Handle the action in the primary module.
    if (module && action) {
      await modules[module].actions[action](data);
    }
    
    const currentRoute = router.getCurrentRoute();

    layout.update(currentRoute);

    const { mount, unmount } = mounts.get();

    await Promise.all(unmount.map(({ el, viewId }) => views[viewId]?.unmount({ currentRoute, el, modules })));

    await Promise.all(mount.map(async ({ el, viewId }) => {
      views[viewId] = typeof views[viewId] === 'function'
        ? (await views[viewId]())
        : views[viewId];
        
      views[viewId]?.mount({ currentRoute, el, modules });
    }));
  }
}

function createMounts() {
  const mounted: Mounted = {};

  return {
    get,
  };

  function get(): Mounts {
    const views = Array.from(document.querySelectorAll('[data-view-id]'));

    let mount: { el: Element, viewId: string }[] = [];

    const mountedCopy = { ...mounted };

    views.forEach(view => {
      const viewId = view.getAttribute('data-view-id');

      if (!viewId) {
        throw Error('viewId not found');
      }

      if (!mounted[viewId]) {
        mounted[viewId] = view;
        mount.push({ el: view, viewId });
      } else {
        delete mountedCopy[viewId];
      }
    });

    // Any remaining views in mountedCopy are to be unmounted
    const unmount = Object.entries(mountedCopy)
      .map(([viewId, el]) => {
        delete mounted[viewId];
        
        return { el, viewId };
      });

    return {
      mount, unmount,
    };
  }
  
}

export interface Layout {
  update(state: any): void;
}

export type Mounts = { mount: { el: Element, viewId: string }[], unmount: { el: Element, viewId: string }[] }

export type MountParams = { currentRoute: Router.RouteData, el: Element, modules: any };

export interface Module<T extends object = {}, U extends Record<string, Function> = {}> {
  actions: U;
  initialState?: Partial<T>;
}

type Mounted = Record<string, Element>;