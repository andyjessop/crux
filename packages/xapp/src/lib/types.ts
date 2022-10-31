import { DynamicStore } from '@crux/create-store';
import { Middleware, Reducer } from '@crux/redux-types';

export type NodeTypes<T extends Service<any>[]> = {
  [P in keyof T]: T[P] extends APIType<infer R> ? R : never;
} & unknown[];

export type SelectorTypes<T extends Selector[]> = {
  [P in keyof T]: T[P] extends Selector<any, infer U> ? U : never;
};

export type SelectorOrServiceTypes<T extends (Selector | Service)[]> = {
  [P in keyof T]: T[P] extends Selector<any, infer U>
    ? U
    : T[P] extends APIType<infer R>
    ? R
    : never;
};

export type SelectorOrSliceTypes<T extends (Selector | Slice)[]> = {
  [P in keyof T]: T[P] extends Selector<any, infer U> ? U : T[P] extends Slice<infer S> ? S : never;
};

export type Selector<T = any, U = any> = (state: T) => U;

export type LayoutSelector = (state: any) => { [key: string]: string };

export type APIType<T> = { getAPI(): Promise<T> };

export type Service<I = any> = APIType<I> & {
  getInstance(): Promise<I>;
  instance?: I;
  promise?: Promise<I>;
};

export type ViewInstance<D = any, A = any> = (root: HTMLElement) => (data: D, actions: A) => void;

export type View<D = any, A = any> = {
  get: () => Promise<ViewInstance<D, A>>;
  getCurrentData: () => D | undefined;
  instance?: ViewInstance<D, A>;
  promise?: Promise<ViewInstance<D, A>>;
  render: (root: HTMLElement, state: any) => void | Promise<void>;
  root: string;
  updateData(state: any): boolean;
};

export type Slice<State = any, API = any> = APIType<API> & {
  bindStore(store: DynamicStore): void;
  getInstance(): Promise<SliceInstance<State, API>>;
  getStore(): DynamicStore | undefined;
  getPromise(): Promise<SliceInstance<State, API>> | undefined;
  getUnregister(): (() => void) | undefined;
  name: string;
  register(middleware?: Middleware, reducer?: Reducer<State>): void;
  selector(state: { [key: string]: State }): State;
  shouldBeEnabled?(state: any): boolean;
  store?: DynamicStore;
};

export type SliceInstance<State, API = any> = {
  api: API;
  middleware?: Middleware;
  reducer: Reducer<State>;
};
