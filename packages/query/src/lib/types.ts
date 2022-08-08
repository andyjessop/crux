import { query } from "./query/query";

export interface Action<Payload = unknown> {
  meta?: any;
  payload: Payload;
  type: string;
}

export type Dispatch<A extends Action = Action> = {
  <T extends A>(action: T): T
};

export type Reducer<S = unknown, A extends Action = Action> = (
  state: S | undefined,
  action: A
) => S;

export interface MiddlewareAPI<D extends Dispatch = Dispatch, S = unknown> {
  dispatch: D
  getState(): S
}

export type Middleware = (api: MiddlewareAPI) => (next: Dispatch) => void;

export interface State<D, E> {
  data: D | null;
  error: E | null;
  loading: boolean;
  updating: boolean;
}

export type MutationConfig<Data = any> = {
  query: ((...params: any[]) => (data: Data) => any) | ((...params: any[]) => any),
  optimistic?: ((...params: any[]) => (data: Data) => any) | ((...params: any[]) => any),
  options?: {
    refetchOnSuccess?: boolean,
  }
}

export type API = ReturnType<typeof query>;

export type ResourceConfig<Data = any> = {
  query: (...params: any[]) => Promise<Data>,
  mutations: {
    [key: string]: MutationConfig<Data>
  },
  options?: Options,
}

export type Options = {
  lazy?: boolean,
  keepUnusedDataFor?: number,
  maxRetryCount?: number,
  pollingInterval?: number,
  refetchOnError?: boolean,
}

export type Resource<T extends ResourceConfig> = {
  onError: <K extends 'get' | (keyof Mutations<T>) >(
    method: K,
    callback: ({ state }: { state: State<Data<T>, Err> }, error: Err) => void,
  ) => void;

  onFetch: <K extends 'get' | (keyof Mutations<T>) >(
    method: K,
    callback: ({ state }: { state: State<Data<T>, Err> }, ...params: T extends keyof Mutations<T> ? MutationParams<T, K> : QueryParams<T>) => void,
  ) => void;

  onSuccess: <K extends 'get' | (keyof Mutations<T>) >(
    method: K,
    callback: ({ state }: { state: State<Data<T>, Err> }, data: T extends keyof Mutations<T> ? FinalReturnType<T['mutations'][K]['query']> : Data<T>) => void,
  ) => void;

  subscribe: (...params: QueryParams<T>) => {
    getState: () => Data<T>;
    unsubscribe: () => void,
    refetch: () => Promise<void>,
    manualUpdate: (data: Data<T>) => void,
    mutations: Mutations<T>,
    select: (state: unknown) => State<Data<T>, Err> | undefined;
  }
}

export type Transform<Data> =  ((...params: any[]) => (data: Data) => any) | ((...params: any[]) => any);

export type Endpoint<Data, Err> = {
  clearSelfDestructTimeout?: () => void;
  destroyEndpoint: () => void;
  refetch: () => Promise<void>;
  manualUpdate: (data: Data) => void;
  mutations: Record<string, ((...params: any[]) => (data: Data) => any) | ((...params: any[]) => any)>;
  pollingInterval?: ReturnType<typeof setInterval>;
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

/**
 * UTILITY TYPES
 * =============
 */
 export type FinalReturnType<T> = {
  0: T;
  1: T extends (...args: any) => infer R ? FinalReturnType<R> : T;
}[T extends (...args: any) => infer _ ? 1 : 0];

export type Params<T> = T extends ((...params: infer R) => Promise<any>) ? R : any[];

export type QueryParams<T> = T extends ((...params: infer R) => any) ? R : any[];

type MutationParams<T extends ResourceConfig, K extends keyof T['mutations']> = T['mutations'][K]['query'] extends ((...params: infer R) => any) ? R : any[];

type Mutations<T extends ResourceConfig> = {
  [P in keyof T['mutations']]: (
    ...params: MutationParams<T, P>
    ) => FinalReturnType<T['mutations'][P]['query']>;
  };

// To get the data param, first infer from the query. If not, infer from the mutations
type Data<T extends ResourceConfig> = T['query'] extends ((...params: any[]) => (data: any) => Promise<infer R>) | ((...params: any[]) => Promise<infer R>) ? R : any;
type Err = any;