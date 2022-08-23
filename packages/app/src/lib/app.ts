import { createAsyncQueue } from '@crux/async-queue'
import type { Action, Dispatch, DispatchActionOrThunk, MiddlewareAPI } from '@crux/redux-types'
import { di } from '@crux/di'
import { slice as createSlice } from '@crux/redux-slice'
import { createStore } from './redux-store';
import { asymmetricDifference } from '@crux/set-utils';
import type { Logger } from './logger';
import type { Config, CoreState, LayoutView, Module, ModuleConfig, ModuleConfigCollection, ModuleReturn, Regions, View, ViewConfig, ViewConfigCollection } from './types';

export async function createApp<S, V>({
  modules: moduleConfigsCollection,
  root,
  services: serviceConfigsCollection,
  views: viewConfigsCollection
}: Config<S, V>, {
  logger,
}: {
  logger?: Logger,
} = {}) {
  const { addMiddleware, addReducer, store } = createStore();

  const servicesContainer = di(serviceConfigsCollection);

  const modules = createModuleMap(moduleConfigsCollection);
  const views = createViewMap(viewConfigsCollection);
  const mountedViews = new Map<string, View<S>>();

  const queue = createAsyncQueue();

  const registeredActions: Record<string, Record<string, (...args: any) => void>> = {};

  let busy = true;

  const { actions: coreActions, reducer: coreReducer } = createSlice({
    initReducer: (state: { regions: Regions }) => state,
    setRegions: (state: { regions: Regions }, payload: string[]) => ({
      ...state,
      regions: [...state.regions, ...payload],
    }),
  }, { initialState: { regions: [] as Regions }, name: '__crux' });

  addReducer('__cruxCore', coreReducer);

  addMiddleware(middleware);

  await initLayout(store.dispatch);

  busy = false;

  store.dispatch({ type: '__crux/ready', payload: undefined });

  return {
    addMiddleware,
    addReducer,
    store,
  }

  async function initLayout(dispatch: Dispatch) {
    /**
     * Module
     */
    const layoutModule = modules.get('layout') as Module<S>;

    const createInstance = await layoutModule.factory();

    const { middleware, reducer } = createInstance() as ModuleReturn;

    layoutModule.unregister = registerModule('layout', dispatch as DispatchActionOrThunk, { middleware, reducer });

    dispatch(coreActions.initReducer());

    /**
     * View
     */
    const layoutView = views.get('layout') as LayoutView<S>;

    layoutView.render = await layoutView.factory();
  }

  function middleware(api: MiddlewareAPI) {
    return function m(next: Dispatch) {
      return async function handleAction(action: Action) {
        if (
          action.type === coreActions.initReducer.type ||
          action.type === coreActions.setRegions.type) {

          logger?.log('info', JSON.stringify({
            message: 'Is core action. Passing to reducers.',
          }));

          next(action);

          return;
        }

        if (busy) {
          logger?.log('info', JSON.stringify({
            message: 'Crux is busy. Adding action to queue.',
          }));

          queue.add(api.dispatch, action);

          return;
        }

        logger?.log('info', JSON.stringify({
          message: 'Crux is not busy. Passing to reducers',
        }));

        next(action);

        busy = true;

        const newModules = await registerModules(api.getState(), api.dispatch);

        if (newModules.length) {         
          logger?.log('info', JSON.stringify({
            message: 'New modules',
            data: newModules
          }));

          api.dispatch(coreActions.initReducer());
        }

        const regions = await renderLayout(api.getState());

        if (regions) {
          logger?.log('info', JSON.stringify({
            message: 'New regions',
            data: regions
          }));
          
          api.dispatch(coreActions.setRegions(regions));
        }

        await mountViews(api.getState());

        busy = false;

        queue.flush();
      }
    }
  }

  function registerModule(name: string, dispatch: DispatchActionOrThunk, moduleReturn?: ModuleReturn): () => void {
    let removeMiddleware: () => void;
    let removeReducer: () => void;

    if (!moduleReturn) {
      return () => { /* */ };
    }

    const { actions, middleware, reducer } = moduleReturn;

    if (actions) {
      registeredActions[name] = Object.entries(actions).reduce((acc, [key, actionCreator]) => {
        acc[key] = (payload: Action['payload']) => dispatch(actionCreator(payload));

        return acc;
      }, {} as Record<string, (payload: Action['payload']) => void>);
    }

    if (middleware) {
      removeMiddleware = addMiddleware(middleware);
    }

    if (reducer) {
      removeReducer = addReducer(name, reducer);
    }
 
    return function unregisterModule() {
      if (actions) {
        delete registeredActions[name];
      }

      removeMiddleware?.();
      removeReducer?.();
    }
  }

  async function registerModules(state: any, dispatch: Dispatch) {
    const modulesAdded: string[] = [];

    for (const moduleName of modules.keys()) {
      const whichModule = modules.get(moduleName) as Module<S>;
      
      const { deps = [], destroy, enabled, factory, unregister } = whichModule;

      const shouldBeEnabled = enabled(state);

      const isRegistered = unregister;
      const shouldRegister = shouldBeEnabled && !isRegistered;
      const shouldUnregister = !shouldBeEnabled && isRegistered;

      if (shouldUnregister) {
        // debugger;
        unregister?.();
        destroy?.();
      }

      if ((isRegistered && shouldBeEnabled) || !shouldRegister) {
        continue;
      }

      const createInstance = await factory();
      
      const depInstances = await Promise.all(deps.map(dep => servicesContainer.get(dep as keyof S & string)));

      const slice = createInstance(...depInstances);

      whichModule.unregister = registerModule(moduleName, dispatch as DispatchActionOrThunk, slice);

      modulesAdded.push(moduleName);

      continue;
    }

    return modulesAdded;
  }

  async function renderLayout(state: any) {
    const layoutView = views.get('layout') as LayoutView<S>;

    const { currentState, render, selectData } = layoutView;

    const newState = selectData(state);

    if (newState === currentState) {
      return;
    }

    layoutView.currentState = newState;

    await render?.({ ...newState, root });

    // New state is rendered. Get regions from DOM.
    const regions = (Array.from(document.querySelectorAll('[data-crux-root]')))
      .filter(el => el !== null)
      .map((el) => el.getAttribute('data-crux-root')) as string[];

    return regions;
  };

  async function mountViews(state: any) {
    const newRegions = selectRegions(state);
    const newRegionsSet = new Set(newRegions);
    const currentRegionsSet = new Set(mountedViews.keys());

    // Destroy views that are in old but not in new - for current route
    const toDestroy = asymmetricDifference(currentRegionsSet, newRegionsSet);

    for (const region of toDestroy) {
      const view = mountedViews.get(region);

      if (!view) {
        continue;
      }

      view.destroy?.();
      mountedViews.delete(region);
    }

    // Get views that are in new but not in old - for new route
    const toRender = asymmetricDifference(newRegionsSet, currentRegionsSet);

    // Set regions
    for (const region of toRender) {
      const whichView = mapFind(views, 'root', region);

      if (!whichView) {
        logger?.log('debug', JSON.stringify({
          message: `No view found for root ${region}`,
        }));

        continue;
      }

      const whichViewCopy = { ...whichView };

      const rootName = newRegions.find(r => r === region);

      whichViewCopy.rootEl = document.querySelector(`[data-crux-root=${rootName}`);

      whichViewCopy.render = await whichView.factory();

      mountedViews.set(region, { ...whichViewCopy });
    }

    // Render views whose state has changed
    for (const view of mountedViews.values()) {
      const { currentState, render, root, rootEl, selectActions, selectData } = view;

      const newState = selectData(state);

      logger?.log('debug', JSON.stringify({
        message: `Current state for view ${root}`,
        data: JSON.stringify(newState),
      }));

      if (newState === currentState) {
        return;
      }

      view.currentState = newState;

      await render?.({ ...newState, root: rootEl, ...selectActions?.(registeredActions) });
    }
  }

  function selectRegions(state: { __cruxCore: CoreState }) {
    return state.__cruxCore.regions;
  }
}

function createModuleMap<S>(moduleConfigCollection: ModuleConfigCollection<S>) {
  return Object.entries(moduleConfigCollection)
  .reduce((acc, [key, value]) => {
    acc.set(key, createModule(value));

    return acc;
  }, new Map<string, Module<S>>())
}

function createModule<S>(redux: ModuleConfig<S>): Module<S> {
  return {
    ...redux,
    currentState: null,
    global: Boolean(redux.global),
  }
}

function createViewMap<S, V>(viewConfigCollection: ViewConfigCollection<S, V>) {
  return Object.entries(viewConfigCollection)
    .reduce((acc, [key, value]) => {
      acc.set(key, createView(value as ViewConfig<S>));

      return acc;
    }, new Map<string, View<S>>())
}

function createView<S>(viewConfig: ViewConfig<S>): View<S> {
  return {
    ...viewConfig,
    currentState: null,
  }
}

function mapFind(map: Map<string, any>, prop: string, value: any) {
  for (const [key, val] of map.entries()) {
    if (val[prop] === value) {
      return val;
    }
  }
}