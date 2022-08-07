import { Action, Dispatch, Middleware, MiddlewareAPI, Reducer } from '@crux/query';
import { combineReducers, compose, Store } from 'redux';

export const middlewareRegistry = (middlewares: Middleware[]) => {
  const mdw = middlewares || [];

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
    },

    remove: (middlewareFn: Middleware) => {
      const index = mdw.findIndex(d => d === middlewareFn);

      mdw.splice(index, 1);
    },
  }
};

export const reducerRegistry = (rdcr: Reducer) => {
  const reducers = rdcr || {};

  return {
    add: (store: Store, reducer: Reducer, namespace: string) => {
      (reducers as any)[namespace] = compose((reducers as any)[namespace] || (a => a), reducer);

      store.replaceReducer(combineReducers({ ...reducers }));
    },

    remove: (store: Store, namespace: string) => {
      delete (reducers as any)[namespace];

      const stateKeys = Object.keys(store.getState());
      const reducerKeys = new Set(Object.keys(reducers));

      stateKeys
        .filter(key => !reducerKeys.has(key)) // state has a key that doesn't have a corresponding reducer
        .forEach(key => {
          (reducers as any)[key] = (state: unknown) => state === undefined ? null : state;
        });
      store.replaceReducer(combineReducers({ ...reducers }));
    },
  }
};