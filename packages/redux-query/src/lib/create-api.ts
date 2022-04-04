import { mergeReducers } from "@crux/redux-utils";
import { generateRandomId } from "@crux/string-utils";
import { combineReducers, AnyAction, MiddlewareAPI, Dispatch, Reducer } from "redux";
import { createDataSlice } from "./create-data-slice";
import { Resource, State } from "./types";

type ReturnPromiseType<T extends (...args: any) => Promise<any>> = T extends (...args: any) => Promise<infer R> ? R : any;

type ReadParams<T> = T extends { api: ((...params: infer R) => (state: any) => Promise<any>) | ((...params: infer R) => Promise<any>) } ? R : any;

export function createAPI<T extends Record<string, () => Promise<Resource<any, any>>>>(resources: T) {
  const endpoints: Record<string, any> = {};
  const reducers = new Map<string, Reducer>();
  let cachedReducer: Reducer;
  const reducerId = generateRandomId();

  registerReducer('placeholder', <S>(state?: S) => !state ? {} : state);

  let dispatch: Dispatch;
  let getState: () => any;

  return {
    getResourceConfig,
    middleware,
    resource,
    reducer,
    reducerId,
  }

  function middleware(api: MiddlewareAPI<Dispatch, any>) {
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

  function getEndpointState(id: string) {
    return function state() {
      return getState()[reducerId][id] as State<any, any>;
    }
  }

  async function getResourceConfig<K extends keyof T & string>(key: K) {
    const res = await resources[key]() as ReturnPromiseType<T[K]>;

    type Data<T> = T extends Resource<infer R, any> ? R : any;
    type Error<T> = T extends Resource<any, infer R> ? R : any;

    return {
      res,
      data: {data: true} as Data<typeof res>,
      error: {error: true} as Error<typeof res>,
      params,
    }

    function params(...p: ReadParams<ReturnPromiseType<T[K]>>) {
      return p;
    }
  }

  async function resource<K extends keyof T & string>(key: K) {
    const res = (await resources[key]()) as ReturnPromiseType<T[K]>;

    type Data = typeof res extends Resource<infer R, any> ? R : any;
    type Error = typeof res extends Resource<any, infer R> ? R : any;

    return {
      [res.name]: register,
    };

    function register(...params: ReadParams<ReturnPromiseType<T[K]>>) {
      // get unique ID for this read endpoint.
      const id = JSON.stringify([key, ...params]);
      
      if (!endpoints[id]) {
        endpoints[id] = {
          destroyEndpoint,
          manualUpdate,
          startSelfDestructTimeout,
          subscriptions: new Set(),
        }
      } else {
        // Clear the self destruct timer if it exists because we're adding
        // a new subscription
        endpoints[id]?.clearSelfDestructTimeout?.();
      }

      const endpoint = endpoints[id];

      endpoint.subscriptions.add(unsubscribe);
      
      // Holds mutation calls
      endpoint.mutations = {};
      
      const mutateReducers: Record<string, Reducer> = {};
      const mutateReducersArr = [];

      if (res.mutations) {
        for (const mutateMethodName of Object.keys(res.mutations)) {
          const mutationSlice = createDataSlice<Data, Error>({
            api: res.mutations[mutateMethodName]['api'],
            dispatch,
            endpointId: id,
            getState: getEndpointState(id),
            name: mutateMethodName,
            optimisticUpdate: res.mutations[mutateMethodName].optimisticUpdate,
            options: res['options'], // use options from GET config
            resource: key,
            type: res.mutations[mutateMethodName]['type']
          });

          endpoint.mutations[mutateMethodName] = mutationSlice.call;
          mutateReducers[mutateMethodName] = mutationSlice.reducer;
          mutateReducersArr.push(mutationSlice.reducer);
        }
      }
      
      const fetchSlice = createDataSlice<Data, Error>({
        api: res['api'],
        dispatch,
        endpointId: id,
        getState: getEndpointState(id),
        name: 'get',
        options: res['options'],
        resource: key,
        type: 'read',
      });

      endpoint.reducer = mergeReducers([
        ...mutateReducersArr,
        fetchSlice.reducer,
      ]);

      // register reducer
      endpoint.unregisterReducer = registerReducer(key, endpoint.reducer);

      endpoint.fetch = () => {
        if (res.options?.pollingInterval && endpoint?.pollingInterval === undefined) {
          endpoint.pollingInterval = setInterval(() => {
            fetchSlice.call(...params);
          }, <number>res.options?.pollingInterval * 1000);

          // Polling interval doesn't start immediately,
          // so we still fetch immediately below.
        }
        
        return fetchSlice.call(...params);
      };

      // Fetch immediately if not lazy
      if (!res.options?.lazy) {
        endpoint.fetch();
      }

      return {
        unsubscribe,
        fetch: endpoint.fetch,
        getState: getEndpointState(id),
        manualUpdate: endpoint.manualUpdate,
        mutations: endpoint.mutations,
      };

      function unsubscribe() {
        endpoint.subscriptions.delete(unsubscribe);

        // If there are no more subscriptions, then we want to remove the reducer and endpoint.
        if (endpoint.subscriptions.size === 0) {
          startSelfDestructTimeout(res.options?.keepUnusedDataFor);
        }
      }

      function destroyEndpoint() {
        clearInterval(endpoint.pollingInterval);
        endpoint.clearSelfDestructTimeout();
        endpoint.unregisterReducer?.();
        delete endpoints[id];
      }

      function manualUpdate(data: Data) {
        dispatch({
          type: `${[res.name]}/get/manual`,
          payload: data,
        });
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