import { Dispatch } from '@reduxjs/toolkit';
import { createSlice } from '..';
import { deserialize as defaultDeserialize } from './helpers/serializer';
import { APICall, OptimisticUpdate, Options, State, Type } from './types';

const reducerMap = {
  create: createPOSTSlice,
  read: createGETSlice,
  update: createPUTSlice,
  delete: createDELETESlice,
}

export function createDataSlice<D, E>({
  api, deserialize = defaultDeserialize, dispatch, endpointId, getState, name, optimisticUpdate, options = {}, resource, type,
}: {
  deserialize?: <T>(str: string) => T;
  api: APICall<D, E>;
  dispatch: Dispatch;
  endpointId: string;
  getState: () => State<D, E>;
  name: string;
  optimisticUpdate?: OptimisticUpdate<D, E>;
  options?: Options<D, E>;
  resource: string;
  type: Type;
}) {

  const initialState: State<D, E> = {
    data: null,
    error: null,
    loading: false,
    updating: false,
  };

  const { actions, reducer } = reducerMap[type](initialState, resource, name, options?.clearDataOnError, optimisticUpdate);

  const call = async (...params: unknown[]) => {    
    // if the pending action takes a parameter, it's always a single parameter of type D.
    const action = actions[`${name}/pending`](<D>params[0]);

    dispatch({
      ...action,
      meta: {
        endpointId,
      }
    });

    const initialCall = api(...params);

    const apiResponse = isPromise(initialCall) ? initialCall : initialCall(getState());
    
    return apiResponse
      .then(res => {
        const action = actions[`${name}/fulfilled`](<D>res);

        dispatch({
          ...action,
          meta: {
            endpointId,
          }
        });

        return res;
      })
      .catch(err => {
        const deserialized = deserialize<E>(err.message);

        const action = actions[`${name}/rejected`](deserialized);

        dispatch({
          ...action,
          meta: {
            endpointId,
          }
        });

        throw err;
      });
  };

  return {
    call, reducer
  };
}

function createGETSlice<Data, E>(initialState: State<Data, E>, resource: string, name: string, clearDataOnError = false) {
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
      data: clearDataOnError ? null : state.data,
      error: payload,
      loading: false,
      updating: false,
    }),
    [`${name}/manual`]: (state: State<Data, E>, payload: Data) => ({
      ...state,
      data: payload
    }),
  }, { initialState, name: resource })
}

function createPOSTSlice<Data, E>(initialState: State<Data, E>, resource: string, name: string, clearDataOnError = false, optimisticUpdate?: OptimisticUpdate<Data, E>) {
  let cached: Data | null;
  
  return createSlice({
    [`${name}/pending`]: (state: State<Data, E>, payload: Data) => {
      if (optimisticUpdate) {
        cached = state.data;
      }
      
      return {
        ...state,
        data: optimisticUpdate ? getOptimisticData<Data, E>(optimisticUpdate, state, payload) : state.data,
        loading: true,
        updating: state.data !== null,
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
      data: clearDataOnError ? null : (optimisticUpdate ? cached : state.data),
      error: payload,
      loading: false,
      updating: false,
    }),
  }, { initialState, name: resource })
}

function createPUTSlice<Data, E>(initialState: State<Data, E>, resource: string, name: string, clearDataOnError = false, optimisticUpdate?: OptimisticUpdate<Data, E>) {
  let cached: Data | null;
  
  return createSlice({
    [`${name}/pending`]: (state: State<Data, E>, payload: Data) => {
      if (optimisticUpdate) {
        cached = state.data;
      }

      return {
        ...state,
        data: optimisticUpdate ? getOptimisticData<Data, E>(optimisticUpdate, state, payload) : state.data,
        loading: true,
        updating: state.data !== null,
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
      data: clearDataOnError ? null : (optimisticUpdate ? cached : state.data),
      error: payload,
      loading: false,
      updating: false,
    }),
  }, { initialState, name: resource })
}

function createDELETESlice<Data, E>(initialState: State<Data, E>, resource: string, name: string, clearDataOnError = false, optimisticUpdate?: OptimisticUpdate<Data, E>) {
  let cached: Data | null;
  
  return createSlice({
    [`${name}/pending`]: (state: State<Data, E>) => {
      if (optimisticUpdate) {
        cached = state.data;
      }
      
      return {
        ...state,
        data: optimisticUpdate ? getOptimisticData<Data, E>(optimisticUpdate, state) : state.data,
        loading: true,
        updating: state.data !== null,
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
      data: clearDataOnError ? null : (optimisticUpdate ? cached : null),
      error: payload,
      loading: false,
      updating: false,
    }),
  }, { initialState, name: resource })
}


function isPromise<T>(obj: unknown): obj is Promise<T> {
  return (<any>obj).then !== undefined;
}

function isSimpleCall<D, E>(obj: D | ((state: State<D, E>) => D | null) | null): obj is ((state: State<D, E>) => D | null) {
  return typeof (<(state: State<D, E>) => D>obj) === 'function';
}

function getOptimisticData<D, E>(optimisticUpdate: OptimisticUpdate<D, E>, state: State<D, E>, payload?: any): D | null {
  const initialCall = optimisticUpdate(payload);

  if (isSimpleCall<D, E>(initialCall)) {
    return initialCall(state);
  }

  return initialCall;
}