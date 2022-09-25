import { createAsyncQueue } from '@crux/async-queue'
import type { Action, Dispatch, DispatchActionOrThunk, GetState, Middleware, MiddlewareAPI, Reducer, Thunk } from '@crux/redux-types'
import { createSlice } from '@crux/redux-slice'
import { createStore } from './redux-store';
import { asymmetricDifference } from '@crux/set-utils';
import type { Logger } from './logger';
import { merge } from '@crux/utils';
import { createResolver } from './resolver';

export interface CoreState {
  regions: Regions;
}

export type Regions = string[];

type Module = {
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
  unregister?: () => void;
};

type ModuleFactory = () => Promise<(...args: any) => Module | Promise<Module>>;
type ViewFactory = () => Promise<Render>;
type ServiceFactory<Deps extends any[] = any[]> = () => Promise<(...args: Deps) => any>;
type Render = (root: HTMLElement, data?: any, actions?: any) => Promise<void> | void;
type ExtractModuleServiceKeys<T extends ModuleFactory> = keyof Awaited<ReturnType<Awaited<ReturnType<T>>>>['services'] & string;

export type CruxContext = {
  dispatch: Dispatch;
  getState: GetState;
  roots: Record<string, string>;
};

export async function createApp<
  T extends {
    modules: Record<string, {
      deps?: ({ 
        [K in (keyof T['modules'])]: `${K & string}.${ExtractModuleServiceKeys<T['modules'][K]["factory"]>}`
      }[keyof T['modules']] | keyof T['services'] & string)[],
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
        selectData?: (state: any) => any, 
        factory: ViewFactory
      }
    },
    root: HTMLElement;
    services: {
      [S in keyof T['services']]: {
        deps?: (Exclude<keyof T['services'] & string, S>)[],
        factory: ServiceFactory
      }
    }
  }
>(config: T, {
  logger,
}: {
  logger?: Logger,
} = {}) {
  type LayoutView = {
    currentData: any,
    selectData?: (state: any) => any, 
    factory: ViewFactory
    render?: Render;
  };

  type LayoutModule = T['layout']['module'] & {
    middleware?: Middleware;
    reducer?: Reducer;
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

  const container = createResolver(serviceConfigsCollection, moduleConfigsCollection);

  const views = new Map<string, View>();
  const layoutView = {
    ...layoutConfig.view,
    currentData: null,
  } as LayoutView;
  const layoutModule = createLayoutModule();
  const mountedViews = new Map<string, View>();
  const registeredModules = new Set<string>();
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
    services: container,
    store,
  }

  async function initLayout(dispatch: Dispatch) {
    /**
     * Module
     */
    const createInstance = await layoutModule.factory();

    const { middleware, reducer } = createInstance(ctx) as Module;

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

        const newModules = await registerModules(api.getState(), api.dispatch as DispatchActionOrThunk);

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

  function registerModule(name: string, dispatch: DispatchActionOrThunk, mod: Module): Module {
    let removeReducer: () => void;
    let removeMiddleware: () => void;

    const { actions, create, destroy, middleware, reducer, views: moduleViews = {} } = mod;

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
 
    mod.unregister = () => {
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

    return mod;
  }

  async function registerModules(state: any, dispatch: DispatchActionOrThunk) {
    const toUnregister = [] as string[];
    const toRegister = [] as string[];

    Object.entries(moduleConfigsCollection).forEach(([key, value]) => {
      if (value.enabled?.(state) === false && registeredModules.has(key)) {
        return toUnregister.push(key);
      } else if (
        (!value.enabled || value.enabled?.(state) === true) && !registeredModules.has(key)) {
        return toRegister.push(key);
      }
    });

    const promises = [];

    for (const key of toUnregister) {
      promises.push(
        container.getModule(key, async (name: string, instance: Promise<Module>) => (await instance).unregister?.())
      );

      registeredModules.delete(key)
    }

    for (const key of toRegister) {
      promises.push(
        container.getModule(key, async (name: string, instance: Promise<Module>) => registerModule(name, dispatch, await instance))
      );

      registeredModules.add(key);
    }

    await Promise.all(promises);
    
    return toRegister;
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

  function createLayoutModule(): LayoutModule {
    return {
      ...layoutConfig.module,
    };
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

