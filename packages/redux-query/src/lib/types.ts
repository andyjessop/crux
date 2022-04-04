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

export type Type = 'read' | 'delete' | 'create' | 'update';

export type APICall<D, E> = ((...params: any[]) => (state: State<D, E>) => Promise<any>) | ((...params: any[]) => Promise<any>);

export type OptimisticUpdate<D, E> = (<P extends any[]>(...params: P) => (state: State<D, E>) => D | null) | (<P extends any[]>(...params: P) => D | null);

export type Mutation<D, E> = {
  api: APICall<D, E>;
  optimisticUpdate?: OptimisticUpdate<D, E>;
  type: Type,
}

export type Resource<D, E> = {
  api: APICall<D, E>,
  mutations?: Record<string, Mutation<D, E>>;
  name: string;
  options?: Options<D, E>,
}