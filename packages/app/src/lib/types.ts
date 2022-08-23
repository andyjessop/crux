import type { Action, Middleware, Reducer, Thunk } from '@crux/redux-types'

export interface CoreState {
  regions: Regions;
}

export type ActionCreatorCollection<K extends string = any> = Record<K, (...args: any) => Action<any> | Thunk>;
export type SelectActionCreators = (state: any) => ActionCreatorCollection;

export type Render = (props: { root: HTMLElement; } & any) => void | Promise<void>;

export type Regions = string[];

export type ServiceConfig<S> = {
  factory: () => Promise<(...args: any) => any>
  deps?: (keyof S)[]
}

export type SliceConfig<S> = {
  factory: () => Promise<(...args: any) => ModuleReturn | undefined>
  deps?: (keyof S)[]
}

export type ModuleReturn = {
  actions?: ActionCreatorCollection,
  destroy?: () => void;
  middleware?: Middleware;
  reducer?: Reducer;
};

export type ModuleConfig<S> = {
  enabled: (state: any) => boolean;
  global?: boolean;
} & SliceConfig<S>;

export type ModuleConfigCollection<S> = Record<string, ModuleConfig<S>>;

export type Module<S> = ModuleConfig<S> & {
  actions?: ActionCreatorCollection;
  currentState: any;
  destroy?: () => void;
  global: boolean;
  middleware?: Middleware;
  reducer?: Reducer;
  unregister?: () => void;
}

export type ServiceConfigCollection<S> = {
  [K in keyof S]: ServiceConfig<S>
};

export type ViewConfig<S> = {
  root: string;
  selectActions?: SelectActionCreators;
  selectData: (state: any) => any;
} & ServiceConfig<S>;

export type ViewConfigCollection<S, V> = { layout: LayoutViewConfig<S> } & {
  [K in keyof V]: K extends 'layout' ? LayoutViewConfig<S> : ViewConfig<S>;
}

export type View<S> = ViewConfig<S> & {
  currentState: any;
  destroy?: () => void;
  render?: Render;
  rootEl?: HTMLElement;
  selectActions?: SelectActionCreators;
}

export type LayoutViewConfig<S> = {
  selectData: (state: any) => any;
} & ServiceConfig<S>;

export type LayoutView<S> = LayoutViewConfig<S> & {
  currentState: any;
  render?: Render;
}

export type Config<S, V> = {
  modules: ModuleConfigCollection<S>;
  root: HTMLElement;
  services: ServiceConfigCollection<S>;
  views: ViewConfigCollection<S, V>;
}