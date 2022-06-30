import { combineReducers, mergeReducers } from "@crux/redux-utils";
import { generateRandomId } from "@crux/string-utils";
import { AnyAction, MiddlewareAPI, Dispatch, Reducer } from "redux";
import { createDataSlice } from "./create-data-slice";
import { Endpoint, FinalReturnType, OperationType, ResourceConfig, State } from "./types";

export function createAPI(rId?: string) {
  const endpoints: Record<string, Endpoint<any, any>> = {};
  const reducers = new Map<string, Reducer>();
  let currentReducer: Reducer;
  const reducerId = rId || generateRandomId();

  let dispatch: Dispatch;
  let getState: () => any;

  return {
    createResource,
    middleware,
    reducer,
    reducerId,
    resources: endpoints,
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

          endpoints[id]?.refetch?.();
        }
      }
    }
  }

  function reducer<S>(state: S, action: AnyAction) {
    if (!currentReducer) {
      return state ?? {};
    }

    return currentReducer(state, action);
  }

  function registerReducer(id: string, newReducer: Reducer) {
    reducers.set(id, newReducer);

    currentReducer = combineReducers(Object.fromEntries(reducers));

    return function unregisterReducer() {
      reducers.delete(id);

      currentReducer = combineReducers(Object.fromEntries(reducers));
    }
  }

  function createResource<Config extends ResourceConfig>(key: string, config: Config) {
    // Type inference for mutations and their params
    type QueryParams = typeof config['query'] extends ((...params: infer R) => any) ? R : any[];

    type MutationParams<K extends keyof typeof config['mutations']> = typeof config['mutations'][K]['query'] extends ((...params: infer R) => any) ? R : any[];

    type Mutations = {
      [P in keyof typeof config['mutations']]: (
        ...params: MutationParams<P>
        ) => FinalReturnType<typeof config['mutations'][P]['query']>;
      };

    // To get the data param, first infer from the query. If not, infer from the mutations
    type Data = typeof config['query'] extends ((...params: any[]) => (data: any) => Promise<infer R>) | ((...params: any[]) => Promise<infer R>) ? R : any;
    type Err = any;

    const listeners = {
      onError: [],
      onFetch: [],
      onSuccess: []
    };

    return {
      onError,
      onFetch,
      onSuccess,
      subscribe,
    };

    function createNotifyError(id: string) {
      return function notifyError(name: string, error: Err) {
        notify(id, listeners.onError, name, [error]);
      }
    }

    function createNotifyFetch(id: string) {
      return function notifyFetch(name: string, ...params: QueryParams) {
        notify(id, listeners.onFetch, name, params);
      }
    }

    function createNotifySuccess(id: string) {
      return function notifySuccess(name: string, data: Data) {
        notify(id, listeners.onSuccess, name, [data]);
      }
    }

    function notify<T extends any[]>(id: string, lists: any[], name: string, params: T) {
      const endpoint = endpoints[id];

      if (!endpoint || !lists.length) {
        return;
      }
      const state = endpoint.select(getState());

      for (const listener of lists) {
        if (listener.method === name) {
          listener.callback({ state }, ...params);
        }
      }
    }

    function onError<T extends 'get' | (keyof Mutations) >(
      method: T,
      callback: ({ state }: { state: State<Data, Err> }, error: Err) =>  void | Promise<void>,
    ) {
      listeners.onError.push({ method, callback });
    }

    function onFetch<T extends 'get' | (keyof Mutations)>(
      method: T,
      callback: ({ state }: { state: State<Data, Err> }, ...params: T extends keyof Mutations ? MutationParams<T> : QueryParams) =>  void | Promise<void>,
    ) {
      listeners.onFetch.push({ method, callback });
    }

    function onSuccess<T extends 'get' | (keyof Mutations) >(
      method: T,
      callback: ({ state }: { state: State<Data, Err> }, data: T extends keyof Mutations ? FinalReturnType<typeof config['mutations'][T]['query']> : Data) =>  void | Promise<void>,
    ) {
      listeners.onSuccess.push({ method, callback });
    }

    function subscribe(...params: QueryParams) {
      const id = createEndpointId(key, params);
      const notifyError = createNotifyError(id);
      const notifyFetch = createNotifyFetch(id);
      const notifySuccess = createNotifySuccess(id);

      if (!endpoints[id]) {
        endpoints[id] = {
          destroyEndpoint,
          manualUpdate,
          mutations: {},
          refetch,
          select,
          startSelfDestructTimeout,
          subscriptions: new Set(),
        } as Endpoint<Data, Err>
      } else {
        // Clear the self destruct timer if it exists because we're adding
        // a new subscription
        endpoints[id]?.clearSelfDestructTimeout?.();
      }

      const endpoint = endpoints[id] as Endpoint<Data, Err>;

      endpoint.subscriptions.add(unsubscribe);

      const handleError = (name: string, error: Err) => {
        if (config['options'].refetchOnError) {
          refetch();
        }

        notifyError(name, error);
      }

      const fetchSlice = createDataSlice<Data, Err, QueryParams>({
        dispatch,
        endpointId: id,
        getState: () => endpoint.select(getState()),
        name: 'get',
        onError: handleError,
        onFetch: notifyFetch,
        onSuccess: notifySuccess,
        options: config.options,
        query: config['query'],
        resource: key,
        type: OperationType.Read,
      });
      
      const mutateReducersArr = [];

      if (config.mutations) {
        for (const mutateMethodName of Object.keys(config.mutations)) {
          const handleSuccess = async (name: string, data: Data) => {
            // refetch on success defaults to true
            if (config.mutations[mutateMethodName]['options'].refetchOnSuccess ?? true) {
              await refetch();
            }

            notifySuccess(name, data);
          }

          const mutationSlice = createDataSlice<Data, Err, MutationParams<typeof mutateMethodName>>({
            dispatch,
            endpointId: id,
            getState: () => endpoint.select(getState()),
            name: mutateMethodName,
            onError: notifyError,
            onFetch: notifyFetch,
            onSuccess: handleSuccess,
            optimisticTransform: config.mutations[mutateMethodName]['options']?.optimisticTransform,
            options: config.options,
            query: config.mutations[mutateMethodName]['query'],
            resource: key,
            type: config.mutations[mutateMethodName]['type'] || mutateMethodName as OperationType,
          });

          endpoint.mutations[mutateMethodName] = mutationSlice.call;
          mutateReducersArr.push(mutationSlice.reducer);
        }
      }

      endpoint.reducer = mergeReducers([
        fetchSlice.reducer,
        ...mutateReducersArr,
      ]);

      // register reducer
      endpoint.unregisterReducer = registerReducer(id, endpoint.reducer);

      dispatch({
        payload: { id },
        type: `${reducerId}/initSubscription`
      });

      // Fetch immediately if not lazy
      if (!config.options?.lazy) {
        endpoint.refetch();
      }

      return {
        getState: () => select(getState()),
        unsubscribe,
        refetch: endpoint.refetch,
        manualUpdate: endpoint.manualUpdate,
        mutations: endpoint.mutations as Mutations,
        select: endpoint.select
      };

      async function refetch() {
        if (config.options?.pollingInterval && endpoint?.pollingInterval === undefined) {
          endpoint.pollingInterval = setInterval(() => {
            fetchSlice.call(...params);
          }, <number>config.options?.pollingInterval * 1000);

          // Polling interval doesn't start immediately,
          // so we still fetch immediately below.
        }
        
        return fetchSlice.call(...params);
      }

      function unsubscribe() {
        endpoint.subscriptions.delete(unsubscribe);

        // If there are no more subscriptions, then we want to remove the reducer and endpoint.
        if (endpoint.subscriptions.size === 0) {
          startSelfDestructTimeout(config.options?.keepUnusedDataFor);
        }
      }

      function destroyEndpoint() {
        clearInterval(endpoint.pollingInterval);
        endpoint.clearSelfDestructTimeout?.();
        endpoint.unregisterReducer?.();
        delete endpoints[id];
      }

      function manualUpdate(data: Data) {
        dispatch({
          type: `${key}/get/manual`,
          payload: data,
        });
      }

      function select(state: unknown): State<Data, Err> | undefined {
        return state[reducerId]?.[id] as State<Data, Err> | undefined;
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
  return params.length ? `${key}|${params.map(JSON.stringify).join('|')}` : key;
}