import { Action, Dispatch, Middleware, MiddlewareAPI, Reducer } from '@crux/query';
import { combineReducers, compose } from 'redux';

export const middlewareRegistry = () => {
  const mdw: Middleware[] = [];

  return {
    middleware: ({ getState, dispatch }: MiddlewareAPI) => (next: Dispatch) => (action: Action) => {
      const middlewareAPI = {
        getState,
        dispatch: (act: Action) => dispatch(act),
      } as MiddlewareAPI;

      const chain = mdw.map(m => m(middlewareAPI));

      return (compose(...chain)(next) as Dispatch)(action);
    },

    add: (m: Middleware, order?: number) => {
      if (order === undefined) {
        mdw.push(m);
      } else {
        mdw.splice(order, 0, m);
      }

      return () => {
        const index = mdw.findIndex(d => d === m);

        if (index < 0) {
          return;
        }
  
        mdw.splice(index, 1);
      }
    },

    getIndex: (m: Middleware) => {
      return mdw.findIndex(d => d === m);
    }
  }
};

export const reducerRegistry = () => {
  const reducers = new Map<string, Reducer>();
  let currentReducer: Reducer = <S>(state?: S) => state || {};

  return {
    add,
    reducer: currentReducer,
  };

  function add(id: string, newReducer: Reducer) {
    reducers.set(id, newReducer);

    currentReducer = combineReducers(Object.fromEntries(reducers)) as Reducer;

    return function unregisterReducer() {
      reducers.delete(id);

      currentReducer = combineReducers(Object.fromEntries(reducers)) as Reducer;
    }
  }
};