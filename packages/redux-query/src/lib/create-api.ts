import { mergeReducers } from "@crux/redux-utils";
import { generateRandomId } from "@crux/string-utils";
import { combineReducers, AnyAction, MiddlewareAPI, Dispatch, Reducer } from "redux";
import { createDataSlice } from "./create-data-slice";
import { createUseQuery } from "./create-use-query";
import { Endpoint, LoaderConig, OperationType, Options, Resource, State } from "./types";

export type FinalReturnType<T> = {
  0: T;
  1: T extends (...args: any) => infer R ? FinalReturnType<R> : T;
}[T extends (...args: any) => infer _ ? 1 : 0];

export type TypeOfReturnedPromise<T extends (...args: any) => Promise<any>> = T extends (...args: any) => Promise<infer R> ? R : any;
export type Params<T> = T extends ((...params: infer R) => Promise<any>) ? R : any[];
export type Data<T extends LoaderConig, Key extends keyof T & string> = TypeOfReturnedPromise<T[Key]> extends Resource<infer R, any> ? R : any;
export type Err<T extends LoaderConig, Key extends keyof T & string> = TypeOfReturnedPromise<T[Key]> extends Resource<any, infer R> ? R : any;

export function createAPI<T extends LoaderConig>(resources: T) {
  const endpoints: Record<string, Endpoint<any, any>> = {};
  const reducers = new Map<string, Reducer>();
  let cachedReducer: Reducer;
  const reducerId = generateRandomId();

  type FetchParams<Key extends keyof T & string> = Params<TypeOfReturnedPromise<T[Key]>['api']>;
  type Data<Key extends keyof T & string> = TypeOfReturnedPromise<T[Key]> extends Resource<infer R, any> ? R : any;
  type Err<Key extends keyof T & string> = TypeOfReturnedPromise<T[Key]> extends Resource<any, infer R> ? R : any;

  registerReducer('placeholder', <S>(state?: S) => !state ? {} : state);

  let dispatch: Dispatch;
  let getState: () => any;

  return {
    middleware,
    resource,
    reducer,
    reducerId,
    resources: endpoints,
    useQuery,
  }

  /**
   * const { data, error, isLoading } = useQuery('users', { lazy: true }).subscribe(1); 
  */
  function useQuery<K extends keyof T & string>(key: K, opts: Options<Data<K>, Err<K>> = {}) {
    return {
      subscribe,
    };

    function subscribe(...params: FetchParams<K>) {
      return createUseQuery(resource, key, opts, params);
    }
  }

  function middleware(api: MiddlewareAPI<Dispatch, unknown>) {
    // Capture reference to dispatch and getState from store
    dispatch = api.dispatch;
    getState = api.getState;

    return function withNext(next: Dispatch<AnyAction>) {
      return function handleAction(action: AnyAction): void {
        next(action);

        // if is fullfilled and undefined,
        if (
          isFulfilled(action.type) &&
          action['payload'] === undefined) {
            // fetch the read endpoint again
          const id = action['meta']?.endpointId;

          endpoints[id]?.fetch?.();
        }
      }
    }
  }

  function reducer<S>(state: S, action: AnyAction) {
    return cachedReducer(state, action);
  }

  function registerReducer(id: string, newReducer: Reducer) {
    reducers.set(id, newReducer);

    if (reducers.has('placeholder') && id !== 'placeholder') {
      reducers.delete('placeholder');
    }

    cachedReducer = combineReducers(Object.fromEntries(reducers));

    return function unregisterReducer() {
      reducers.delete(id);

      cachedReducer = combineReducers(Object.fromEntries(reducers));
    }
  }

  async function getResource<K extends keyof T & string>(key: K) {
    return (await resources[key]()) as TypeOfReturnedPromise<T[K]>;
  }

  async function resource<K extends keyof T & string>(key: K, opts: Options<Data<K>, Err<K>> = {}) {
    const res = await getResource(key);

    const options = Object.assign({}, res.options || {}, opts);

    // Type inference for mutations and their params
    type Mutations = TypeOfReturnedPromise<T[K]>['mutations'];
    type MutationsObj = {
      [P in keyof Mutations]: (
        ...params: Params<Mutations[P]['api']>
      ) => FinalReturnType<Mutations[P]['api']>;
    };

    return {
      subscribe,
    };

    function subscribe(...params: FetchParams<K>) {
      const id = createEndpointId(key, params);

      if (!endpoints[id]) {
        endpoints[id] = {
          destroyEndpoint,
          fetch,
          manualUpdate,
          mutations: {},
          select,
          startSelfDestructTimeout,
          subscriptions: new Set(),
        } as Endpoint<Data<K>, Err<K>>
      } else {
        // Clear the self destruct timer if it exists because we're adding
        // a new subscription
        endpoints[id]?.clearSelfDestructTimeout?.();
      }

      const endpoint = endpoints[id] as Endpoint<Data<K> ,Err<K>>;

      endpoint.subscriptions.add(unsubscribe);
      
      const mutateReducersArr = [];

      if (res.mutations) {
        for (const mutateMethodName of Object.keys(res.mutations)) {
          const mutationSlice = createDataSlice<Data<K>, Err<K>>({
            api: res.mutations[mutateMethodName]['api'],
            dispatch,
            endpointId: id,
            getState: () => endpoint.select(getState()),
            name: mutateMethodName,
            optimisticUpdate: res.mutations[mutateMethodName].optimisticUpdate,
            options,
            resource: key,
            type: res.mutations[mutateMethodName]['type']
          });

          endpoint.mutations[mutateMethodName] = mutationSlice.call;
          mutateReducersArr.push(mutationSlice.reducer);
        }
      }
      
      const fetchSlice = createDataSlice<Data<K>, Err<K>, FetchParams<K>>({
        api: res['api'],
        dispatch,
        endpointId: id,
        getState: () => endpoint.select(getState()),
        name: 'get',
        options,
        resource: key,
        type: OperationType.Read,
      });

      endpoint.reducer = mergeReducers([
        ...mutateReducersArr,
        fetchSlice.reducer,
      ]);

      // register reducer
      endpoint.unregisterReducer = registerReducer(key, endpoint.reducer);

      // Fetch immediately if not lazy
      if (!res.options?.lazy) {
        endpoint.fetch();
      }

      return {
        unsubscribe,
        fetch: endpoint.fetch,
        manualUpdate: endpoint.manualUpdate,
        mutations: endpoint.mutations as MutationsObj,
        select: endpoint.select
      };

      function fetch() {
        if (res.options?.pollingInterval && endpoint?.pollingInterval === undefined) {
          endpoint.pollingInterval = setInterval(() => {
            fetchSlice.call(...params);
          }, <number>res.options?.pollingInterval * 1000);

          // Polling interval doesn't start immediately,
          // so we still fetch immediately below.
        }
        
        return fetchSlice.call(...params);
      }

      function unsubscribe() {
        endpoint.subscriptions.delete(unsubscribe);

        // If there are no more subscriptions, then we want to remove the reducer and endpoint.
        if (endpoint.subscriptions.size === 0) {
          startSelfDestructTimeout(res.options?.keepUnusedDataFor);
        }
      }

      function destroyEndpoint() {
        clearInterval(endpoint.pollingInterval);
        endpoint.clearSelfDestructTimeout?.();
        endpoint.unregisterReducer?.();
        delete endpoints[id];
      }

      function manualUpdate(state: State<Data<K>, Err<K>>) {
        dispatch({
          type: `${key}/get/manual`,
          payload: state,
        });
      }

      function select(state: unknown): State<Data<K>, Err<K>> {
        return state[reducerId][id] as State<Data<K>, Err<K>>;
      }

      function startSelfDestructTimeout(timeInSeconds = 0) {
        const timeout = setTimeout(() => {
          destroyEndpoint();
        }, timeInSeconds * 1000);

        endpoint.clearSelfDestructTimeout = function clearSelfDestructTimeout() {
          clearTimeout(timeout);
        }
      }
    };
  }
}

function isFulfilled(type: string) {
  return type.endsWith('fulfilled');
}

function createEndpointId(key, params) {
  return `${key}|${JSON.stringify(params)}`;
}