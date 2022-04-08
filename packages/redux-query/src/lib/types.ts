import { Reducer } from "redux";

export interface State<D, E> {
  data: D | null;
  error: E | null;
  loading: boolean;
  updating: boolean;
}

export interface Options<D, E> {
  clearDataOnError?: boolean, // default false
  lazy?: boolean,  // conditional fetching (https://redux-toolkit.js.org/rtk-query/usage/conditional-fetching)
  keepUnusedDataFor?: number;
  pollingInterval?: number,
}

export type APICall<D, E> = ((...params: any[]) => (state: State<D, E>) => Promise<any>) | ((...params: any[]) => Promise<any>);

export type OptimisticUpdate<D, E> = ((...params: any[]) => (state: State<D, E>) => D | null) | ((...params: any[]) => D | null);

export type Mutation<D, E> = {
  api: APICall<D, E>;
  optimisticUpdate?: OptimisticUpdate<D, E>;
  type: OperationType,
}

export type Resource<D, E> = {
  api: APICall<D, E>,
  mutations?: Record<string, Mutation<D, E>>;
  options?: Options<D, E>,
}

export type Subscription<Data, Err> = {
  unsubscribe: () => void
} & Pick<Endpoint<Data, Err>, 'fetch' | 'manualUpdate' | 'mutations' | 'select'>;

export type Subscribe<Params extends any[], Data, Err> = (...params: Params) => Subscription<Data, Err>;

export type Endpoint<Data, Err> = {
  clearSelfDestructTimeout?: () => void;
  destroyEndpoint: () => void;
  fetch: () => void;
  manualUpdate: (state: State<Data, Err>) => void;
  mutations: Record<string, Mutation<Data, Err>['api']>;
  pollingInterval?: number;
  reducer?: Reducer;
  select: (state: any) => State<Data, Err>;
  startSelfDestructTimeout: (timeInSeconds?: number) => void;
  subscriptions: Set<() => void>;
  unregisterReducer?: () => void;
}

export enum OperationType {
  Create = 'create',
  Delete = 'delete',
  Read = 'read',
  Update = 'update',
}

export type ResourceFn<T, Params extends any[], Data, Err> = <K extends keyof T & string>(key: K, opts?: Options<Data, Err>) => Promise<{ subscribe: Subscribe<Params, Data, Err> }>

export type LoaderConig = Record<string, () => Promise<Resource<any, any>>>;