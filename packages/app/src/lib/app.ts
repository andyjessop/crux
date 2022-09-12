import { createAsyncQueue } from '@crux/async-queue'
import type { Action, Dispatch, DispatchActionOrThunk, GetState, Middleware, MiddlewareAPI, Reducer, Thunk } from '@crux/redux-types'
import { di } from '@crux/di'
import { createSlice } from '@crux/redux-slice'
import { createStore } from './redux-store';
import { asymmetricDifference } from '@crux/set-utils';
import type { Logger } from './logger';
import { merge } from '@crux/utils';

export interface CoreState {
  regions: Regions;
}

export type Regions = string[];

type ModuleReturn = {
  actions?: Record<string, (...args: any) => Action>,
  create?: (ctx: CruxContext) => void;
  destroy?: (ctx: CruxContext) => void;
  middleware?: Middleware;
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
    }
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
    registered?: boolean;
    unregister?: () => void;
  };

  type ViewConfig = {
    deps?: (keyof T['services'])[],
    selectActions?: (state: any) => any, 
    selectData?: (state: any) => any, 
    factory: ViewFactory,
    root: string;
  };

  type View = ViewConfig & {
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
  } = config;

  const servicesContainer = di(serviceConfigsCollection);

  const modules = createModuleMap();
  const views = new Map<string, View>();
  const layoutView = createLayoutView();
  const layoutModule = createLayoutModule();
  const mountedViews = new Map<string, View>();

  // Add module dependencies and service dependencies here. Don't do it during the unregister/register phase
  // Build graph here

  const queue = createAsyncQueue();

  const registeredActions: Record<string, Record<string, (...args: any) => void>> = {};

  let busy = true;

  type CoreSlice = {
    initReducer: any;
    initSlice: any;
    setRegions: string[];
  }

  const { actions: coreActions, reducer: coreReducer } = createSlice<CoreSlice>()('__crux', { regions: [] as Regions }, {
    initReducer: (state: { regions: Regions }, payload?: any) => state,
    initSlice: (state: { regions: Regions }, payload?: any) => state,
    setRegions: (state: { regions: Regions }, payload: string[]) => merge(state, {
      regions: [...payload],
    }),
  });

  addReducer('__cruxCore', coreReducer);

  addMiddleware(middleware);

  await initLayout(store.dispatch);

  busy = false;

  store.dispatch({ type: '__crux/ready', payload: undefined });

  return {
    addMiddleware,
    addReducer,
    services: servicesContainer,
    store,
  }

  async function initLayout(dispatch: Dispatch) {
    /**
     * Module
     */
    const createInstance = await layoutModule.factory();

    const { middleware, reducer } = createInstance(ctx) as ModuleReturn;

    registerModule('layout', dispatch as DispatchActionOrThunk, { middleware, reducer });

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

        if (newModules?.length) {         
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
    let removeMiddleware: () => void;

    if (!moduleReturn) {
      return () => { /* */ };
    }

    const { actions, create, destroy, middleware, reducer, services: moduleServices = {}, views: moduleViews = {} } = moduleReturn;

    for (const [key, service] of Object.entries(moduleServices)) {
      servicesContainer.register(`${name}.${key}` as keyof T['services'], service);
    }

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

    for (const [key, view] of Object.entries(moduleViews)) {
      views.set(key, createView(view));
    }

    dispatch(coreActions.initSlice(name));

    create?.(ctx);
 
    return function unregisterModule() {
      if (actions) {
        delete registeredActions[name];
      }

      for (const key of Object.keys(moduleViews)) {
        views.delete(key);
      }

      destroy?.(ctx);

      removeMiddleware?.();      
      removeReducer?.();
      
    }
  }

  async function registerModules(state: any, dispatch: Dispatch) {
    const modulesAdded: string[] = [];

    // Sort modules so that dependencies all appear in order. Error if circular dependency

    const keys = [...modules.keys()];
    
    for (let i = 0; i < keys.length; i++) {
      const moduleName = keys[i];

      const whichModule = modules.get(moduleName) as Module;

      const { deps = [], enabled, factory, registered, unregister } = whichModule;

      const shouldBeEnabled = enabled?.(state) ?? true;

      const shouldRegister = shouldBeEnabled && !registered;
      const shouldUnregister = !shouldBeEnabled && registered;

      if (shouldUnregister) {
        unregister?.();
      }

      if ((registered && shouldBeEnabled) || !shouldRegister) {
        continue;
      }

      whichModule.registered = true;

      const createInstance = await factory();      
      
      const depInstances = await Promise.all(deps.map((dep => servicesContainer.get(dep as keyof T["services"] & string))));

      const slice = await createInstance(ctx, ...depInstances);

      whichModule.unregister = registerModule(moduleName, dispatch as DispatchActionOrThunk, slice);

      modulesAdded.push(moduleName);

      modules.set(moduleName, whichModule);

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
    const viewsToRender = [...mountedViews.values()];

    for (let i = 0; i < viewsToRender.length; i++) {
      const { currentData, render, root, rootEl, selectActions, selectData } = viewsToRender[i];
  
      const newData = selectData?.(state);

      logger?.log('debug', JSON.stringify({
        message: `Current state for view ${root}`,
        data: JSON.stringify(newData),
      }));

      if (newData === currentData || rootEl === undefined) {
        continue;
      }

      viewsToRender[i].currentData = newData;

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
  
  function createView(viewConfig: ViewConfig): View {
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

