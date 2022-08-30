import { createAsyncQueue } from '@crux/async-queue'
import type { Action, Dispatch, DispatchActionOrThunk, GetState, Middleware, MiddlewareAPI, Reducer, Thunk } from '@crux/redux-types'
import { di } from '@crux/di'
import { slice as createSlice } from '@crux/redux-slice'
import { createStore } from './redux-store';
import { asymmetricDifference } from '@crux/set-utils';
import type { Logger } from './logger';

export interface CoreState {
  regions: Regions;
}

export type Regions = string[];

type ModuleReturn = {
  actions?: Record<string, (...args: any) => Action>,
  destroy?: () => void;
  middlewares?: Middleware[];
  reducer?: Reducer;
  services?: Record<string, { factory: ServiceFactory<any> }>;
  views?: Record<string, {
    root: string,
    selectActions?: (state: any) => any,
    selectData?: (state: any) => any, 
    factory: ViewFactory
  }>;
};

type ActionCreatorCollection<K extends string = any> = Record<K, (...args: any) => Action<any> | Thunk>;
type ModuleFactory = () => Promise<(ctx: CruxContext, ...args: any) => ModuleReturn | Promise<ModuleReturn>>;
type ViewFactory = () => Promise<Render>;
type ServiceFactory<Deps extends any[] = any[]> = () => Promise<(...args: Deps) => any>;
type Render = (root: HTMLElement, data?: any, actions?: any) => Promise<void> | void;

type ExtractModuleServiceKeys<T extends ModuleFactory> = keyof Awaited<ReturnType<Awaited<ReturnType<T>>>>['services'] & string;

export type CruxContext = {
  dispatch: Dispatch;
  getState: GetState;
};

export async function createApp<
  T extends {
    modules: Record<string, {
      deps?: ({ 
        [K in (keyof T['modules'])]: `${K & string}.${ExtractModuleServiceKeys<T['modules'][K]["factory"]>}`
      }[keyof T['modules']] | keyof T['services'])[],
      enabled?: (state: any) => boolean;
      factory: ModuleFactory
    }>,
    layout: {
      module: {
        deps?: ({ 
          [K in (keyof T['modules'])]: `${K & string}.${ExtractModuleServiceKeys<T['modules'][K]["factory"]>}`
        }[keyof T['modules']] | keyof T['services'])[],
        factory: ModuleFactory
      },
      view: {
        deps?: (keyof T['services'])[],
        selectData?: (state: any) => any, 
        factory: ViewFactory
      }
    },
    root: HTMLElement;
    services: {
      [S in keyof T['services']]: {
        deps?: (Exclude<keyof T['services'], S>)[],
        factory: ServiceFactory
      }
    },
    views: Record<string, {
      root: string,
      selectActions?: (state: any) => any,
      selectData?: (state: any) => any, 
      factory: ViewFactory
    }>,
  }
>(config: T, {
  logger,
}: {
  logger?: Logger,
} = {}) {
  type LayoutView = T['layout']['view'] & { currentData: any, render?: Render };
  type LayoutModule = T['layout']['module'] & {
    middleware?: Middleware;
    reducer?: Reducer;
  };

  type Module = T['modules'][keyof T['modules']] & {
    actions?: ActionCreatorCollection;
    destroy?: () => void;
    middleware?: Middleware;
    reducer?: Reducer;
    unregister?: () => void;
  };

  type View = T['views'][keyof T['views']] & {
    currentActions: any,
    currentData: any,
    destroy?: () => void,
    render?: Render,
    rootEl?: HTMLElement;
  };

  const { addMiddleware, addReducer, store } = createStore();
  const ctx = { dispatch: store.dispatch, getState: store.getState } as CruxContext;
  const {
    layout: layoutConfig,
    modules: moduleConfigsCollection,
    root,
    services: serviceConfigsCollection,
    views: viewConfigsCollection
  } = config;

  const servicesContainer = di(serviceConfigsCollection);

  const modules = createModuleMap();
  const views = createViewMap();
  const layoutView = createLayoutView();
  const layoutModule = createLayoutModule();
  const mountedViews = new Map<string, View>();

  const queue = createAsyncQueue();

  const registeredActions: Record<string, Record<string, (...args: any) => void>> = {};

  let busy = true;

  const { actions: coreActions, reducer: coreReducer } = createSlice({
    initReducer: (state: { regions: Regions }, payload?: any) => state,
    initSlice: (state: { regions: Regions }, payload?: any) => state,
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
    const createInstance = await layoutModule.factory();

    const { middlewares, reducer } = createInstance(ctx) as ModuleReturn;

    registerModule('layout', dispatch as DispatchActionOrThunk, { middlewares, reducer });

    dispatch(coreActions.initReducer('layout'));

    /**
     * View
     */
    layoutView.render = await layoutView.factory();
  }

  function middleware(api: MiddlewareAPI) {
    return function m(next: Dispatch) {
      return async function handleAction(action: Action) {
        if (
          action.type === coreActions.initReducer.type ||
          action.type === coreActions.setRegions.type ||
          action.type === coreActions.initSlice.type) {

          logger?.log('info', JSON.stringify({
            message: 'Is core action. Passing to reducers.',
            data: action,
          }));

          next(action);

          return;
        }

        if (busy) {
          logger?.log('info', JSON.stringify({
            message: 'Crux is busy. Adding action to queue.',
            data: action
          }));

          queue.add(api.dispatch, action);

          return;
        }

        logger?.log('info', JSON.stringify({
          message: 'Crux is not busy. Passing to reducers',
          data: action
        }));

        next(action);

        const newModules = await registerModules(api.getState(), api.dispatch);

        if (newModules.length) {         
          logger?.log('info', JSON.stringify({
            message: 'New modules',
            data: newModules
          }));
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

        logger?.log('info', JSON.stringify({
          message: 'Flushing queue',
          data: queue.entries.map(fn => fn.fn.name)
        }));

        queue.flush();
      }
    }
  }

  function registerModule(name: string, dispatch: DispatchActionOrThunk, moduleReturn?: ModuleReturn): () => void {
    let removeReducer: () => void;
    const removeMiddlewareArray = [] as Array<() => void>;

    if (!moduleReturn) {
      return () => { /* */ };
    }

    const { actions, middlewares, reducer, services: moduleServices = {}, views: moduleViews = {} } = moduleReturn;

    for (const [key, service] of Object.entries(moduleServices)) {
      servicesContainer.register(`${name}.${key}` as keyof T['services'], service);
    }

    if (actions) {
      registeredActions[name] = Object.entries(actions).reduce((acc, [key, actionCreator]) => {
        acc[key] = (payload: Action['payload']) => dispatch(actionCreator(payload));

        return acc;
      }, {} as Record<string, (payload: Action['payload']) => void>);
    }

    if (middlewares) {
      for (const middleware of middlewares) {
        removeMiddlewareArray.push(addMiddleware(middleware));
      }
    }

    if (reducer) {
      removeReducer = addReducer(name, reducer);
    }

    for (const [key, view] of Object.entries(moduleViews)) {
      views.set(key, createView(view as View));
    }

    dispatch(coreActions.initSlice(name));
 
    return function unregisterModule() {
      if (actions) {
        delete registeredActions[name];
      }

      for (const [key, view] of Object.entries(moduleViews)) {
        views.delete(key);
      }

      for (const remove of removeMiddlewareArray) {
        remove();
      }
      
      removeReducer?.();
    }
  }

  async function registerModules(state: any, dispatch: Dispatch) {
    const modulesAdded: string[] = [];

    // Sort modules so that dependencies all appear in order. Error if circular dependency

    for (const moduleName of modules.keys()) {
      const whichModule = modules.get(moduleName) as Module;
      
      const { deps = [], destroy, enabled, factory, unregister } = whichModule;

      const shouldBeEnabled = enabled?.(state) ?? true;

      const isRegistered = unregister;
      const shouldRegister = shouldBeEnabled && !isRegistered;
      const shouldUnregister = !shouldBeEnabled && isRegistered;

      if (shouldUnregister) {
        unregister?.();
        destroy?.();
      }

      if ((isRegistered && shouldBeEnabled) || !shouldRegister) {
        continue;
      }

      const createInstance = await factory();      
      
      const depInstances = await Promise.all(deps.map((dep => servicesContainer.get(dep as keyof T["services"] & string))));

      const slice = await createInstance(ctx, ...depInstances);

      whichModule.unregister = registerModule(moduleName, dispatch as DispatchActionOrThunk, slice);

      modulesAdded.push(moduleName);

      continue;
    }

    return modulesAdded;
  }

  async function renderLayout(state: any) {
    const { currentData, render, selectData } = layoutView;

    const newData = selectData?.(state);

    if (newData === currentData) {
      return;
    }

    layoutView.currentData = newData;

    await render?.(root, newData);

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
      const { currentData, render, root, rootEl, selectActions, selectData } = view;

      const newData = selectData?.(state);

      logger?.log('debug', JSON.stringify({
        message: `Current state for view ${root}`,
        data: JSON.stringify(newData),
      }));

      if (newData === currentData || rootEl === undefined) {
        return;
      }

      view.currentData = newData;

      await render?.(rootEl, newData, selectActions?.(registeredActions));
    }
  }

  function selectRegions(state: { __cruxCore: CoreState }) {
    return state.__cruxCore.regions;
  }

  // UTILS

  function createLayoutView(): LayoutView {
    return {
      ...layoutConfig.view,
      currentData: null
    };
  }

  function createLayoutModule(): LayoutModule {
    return {
      ...layoutConfig.module,
    };
  }

  function createModuleMap() {
    return Object.entries(moduleConfigsCollection)
    .reduce((acc, [key, value]) => {
      acc.set(key, value as Module);
  
      return acc;
    }, new Map<string, Module>())
  }
  
  function createViewMap() {
    return Object.entries(viewConfigsCollection)
      .reduce((acc, [key, value]) => {
        acc.set(key, createView(value as View));
  
        return acc;
      }, new Map<string, View>())
  }
  
  function createView(viewConfig: Omit<View, 'currentData' | 'currentActions' | 'rootEl' | 'render'>): View {
    return {
      ...viewConfig,
      currentActions: null,
      currentData: null,
    } as View;
  }
  
  function mapFind(map: Map<string, any>, prop: string, value: any) {
    for (const [key, val] of map.entries()) {
      if (val[prop] === value) {
        return val;
      }
    }
  }
}

