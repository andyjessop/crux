import { Dispatch } from '@reduxjs/toolkit';
import { createSlice } from './create-slice';
import { OperationType, Transform, Options, ResourceConfig, State } from './types';

const reducerMap = {
  [OperationType.Create]: createPOSTSlice,
  [OperationType.Read]: createGETSlice,
  [OperationType.Update]: createPUTSlice,
  [OperationType.Delete]: createDELETESlice,
}

export function createDataSlice<D, E, P extends unknown[] = unknown[]>({
  dispatch,
  endpointId,
  getState, 
  name,
  onError,
  onFetch,
  onSuccess,
  optimisticTransform,
  options = {},
  query,
  resource,
  type,
}: {
  deserialize?: <T>(str: string) => T;
  dispatch: Dispatch;
  endpointId: string;
  getState: () => State<D, E>;
  name: string;
  onError: (actionType: string, error: E) => void | Promise<void>;
  onFetch: (actionType: string, ...params: P) => void | Promise<void>;
  onSuccess: (actionType: string, data: D) => void | Promise<void>;
  optimisticTransform?: Transform<D>;
  options?: Options;
  query: ResourceConfig['query'];
  resource: string;
  type: OperationType;
}) {

  const initialState: State<D, E> = {
    data: null,
    error: null,
    loading: false,
    updating: false,
  };

  const { actions, reducer } = reducerMap[type](
    initialState, resource, name, optimisticTransform,
  );

  const call = async (...params: P) => {  
    const pendingType = `${name}/pending`;
    const fulfilledType = `${name}/fulfilled`;
    const rejectedType = `${name}/rejected`;

    // if the pending action takes a parameter, it's always a single parameter of type D.
    const action = actions[pendingType](<D>params[0]);

    dispatch({
      ...action,
      meta: {
        endpointId,
      }
    });

    onFetch(name, ...params);

    const initialCall = query(...params);

    const response = isPromise(initialCall) ? initialCall : initialCall(getState().data);
    
    return response
      .then(async (res: D) => {
        const action = actions[fulfilledType](res);

        dispatch({
          ...action,
          meta: {
            endpointId,
          }
        });

        await onSuccess(name, res);

        return res;
      })
      .catch(async (err: E) => {
        const action = actions[rejectedType](err);

        dispatch({
          ...action,
          meta: {
            endpointId,
          }
        });

        await onError(name, err);

        throw err;
      });
  };

  return {
    call, reducer
  };
}

function createGETSlice<Data, E>(initialState: State<Data, E>, resource: string, name: string) {
  return createSlice({
    [`${name}/pending`]: (state: State<Data, E>) => ({
      ...state,
      loading: true,
      updating: state.data !== null,
    }),
    [`${name}/fulfilled`]: (state: State<Data, E>, payload: Data) => ({
      ...state,
      data: payload,
      error: null,
      loading: false,
      updating: false,
    }),
    [`${name}/rejected`]: (state: State<Data, E>, payload: E) => ({
      ...state,
      error: payload,
      loading: false,
      updating: false,
    }),
    [`${name}/manual`]: (state: State<Data, E>, payload: Data) => ({
      ...state,
      data: payload,
    }),
  }, { initialState, name: resource })
}

function createPOSTSlice<Data, E>(initialState: State<Data, E>, resource: string, name: string, optimisticTransform?: Transform<Data>) {
  let cached: Data | null;
  
  return createSlice({
    [`${name}/pending`]: (state: State<Data, E>, payload: Data) => {
      if (optimisticTransform) {
        cached = state.data;
      }
      
      return {
        ...state,
        data: optimisticTransform ? getOptimisticData<Data>(optimisticTransform, state.data, payload) : state.data,
        loading: !optimisticTransform,
        updating: state.data !== null && !optimisticTransform,
      };
    },
    [`${name}/fulfilled`]: (state: State<Data, E>, payload: Data | undefined) => ({
      ...state,
      data: payload === undefined ? state.data : payload,
      error: null,
      loading: false,
      updating: false,
    }),
    [`${name}/rejected`]: (state: State<Data, E>, payload: E) => ({
      ...state,
      data: optimisticTransform ? cached : state.data,
      error: payload,
      loading: false,
      updating: false,
    }),
  }, { initialState, name: resource })
}

function createPUTSlice<Data, E>(initialState: State<Data, E>, resource: string, name: string, optimisticTransform?: Transform<Data>) {
  let cached: Data | null;
  
  return createSlice({
    [`${name}/pending`]: (state: State<Data, E>, payload: Data) => {
      if (optimisticTransform) {
        cached = state.data;
      }

      return {
        ...state,
        data: optimisticTransform ? getOptimisticData<Data>(optimisticTransform, state.data, payload) : state.data,
        loading: !optimisticTransform,
        updating: state.data !== null && !optimisticTransform,
      };
    },
    [`${name}/fulfilled`]: (state: State<Data, E>, payload: Data | undefined) => ({
      ...state,
      data: payload === undefined ? state.data : payload,
      error: null,
      loading: false,
      updating: false,
    }),
    [`${name}/rejected`]: (state: State<Data, E>, payload: E) => ({
      ...state,
      data: optimisticTransform ? cached : state.data,
      error: payload,
      loading: false,
      updating: false,
    }),
  }, { initialState, name: resource })
}

function createDELETESlice<Data, E>(initialState: State<Data, E>, resource: string, name: string, optimisticTransform?: Transform<Data>) {
  let cached: Data | null;
  
  return createSlice({
    [`${name}/pending`]: (state: State<Data, E>) => {
      if (optimisticTransform) {
        cached = state.data;
      }
      
      return {
        ...state,
        data: optimisticTransform ? getOptimisticData<Data>(optimisticTransform, state.data) : state.data,
        loading: !optimisticTransform,
        updating: state.data !== null && !optimisticTransform,
      };
    },
    [`${name}/fulfilled`]: (state: State<Data, E>, payload: Data | null | undefined) => ({
      ...state,
      data: payload === undefined ? state.data : payload, 
      error: null,
      loading: false,
      updating: false,
    }),
    [`${name}/rejected`]: (state: State<Data, E>, payload: E) => ({
      ...state,
      data: optimisticTransform ? cached : null,
      error: payload,
      loading: false,
      updating: false,
    }),
  }, { initialState, name: resource })
}


function isPromise<T>(obj: unknown): obj is Promise<T> {
  return (<any>obj).then !== undefined;
}

function isSimpleCall<D>(obj: D | ((data: D | null) => D | null) | null): obj is ((data: D | null) => D | null) {
  return typeof (<(data: D) => D>obj) === 'function';
}

function getOptimisticData<D>(optimisticTransform: Transform<D>, data: D | null, payload?: any): D | null {
  const initialCall = optimisticTransform(payload);

  if (isSimpleCall<D>(initialCall)) {
    return initialCall(data);
  }

  return initialCall;
}