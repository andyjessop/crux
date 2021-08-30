import { createAsyncQueue, createEventEmitter } from '@crux/utils';
import { di } from '@crux/di';
import { createAdapters } from './adapters/create-adapters';
import { CruxContext, CruxHooks, CruxParams, CruxServices } from './types';
import { createMounter } from './mounter/mounter';
import type { DI } from '@crux/di';
import type { Model } from './adapters/types';

export async function createCrux<T, U extends Record<string, Model>>({
  el,
  layout: createLayout,
  adapters: adaptersCollection = {},
  services: servicesCollection,
  views: viewsCollection,
}: CruxParams<T, U>) {
  const app = di(servicesCollection);

  const crux = di<CruxServices>({
    dispatch: () => dispatch,
    hooks: createEventEmitter,
  });

  const adapters = createAdapters<U, CruxContext<DI<T>>>(adaptersCollection, { crux, app });

  const layout = createLayout(el, crux, app);

  const mounter = createMounter(crux, app, viewsCollection, '[data-view-id]');

  const queue = createAsyncQueue();  

  return {
    app,
    crux,
    destroy,
  };

  function destroy() {}

  function dispatch(moduleName?: string, action?: string, data?: any) {
    queue.add(queuedDispatch, moduleName, action, data);

    queue.flush();
  }

  async function queuedDispatch(adapterName?: keyof U, action?: string, data?: any) {
    const hooks = crux.get('hooks');
    const hookData = { module: adapterName, action, data };

    await hooks?.emit(CruxHooks.BeforeModule, hookData);

    // Handle the action in the primary module.
    if (adapterName && action) {
      let adapter = adapters.get(adapterName);

      if (!adapter) {
        adapter = await adapters.get(adapterName);
      }

      if (adapter) {
        adapter.actions?.[action](data);
      }
    }

    await hooks?.emit(CruxHooks.BeforeLayout, hookData);

    await layout.update(crux, app);

    await hooks?.emit(CruxHooks.BeforeMounter, hookData);

    await mounter.run();

    await hooks?.emit(CruxHooks.AfterMounter, hookData);
  }
}
