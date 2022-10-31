import { legacy_createStore, applyMiddleware, compose } from 'redux';
import { middlewareRegistry, reducerRegistry } from '@crux/redux-registry';
import type { Reducer, Store } from '@crux/redux-types';

export type DynamicStore = ReturnType<typeof createStore>;

export function createStore({ isDev }: { isDev?: boolean } = { isDev: true }) {
  const mRegistry = middlewareRegistry();
  const rRegistry = reducerRegistry();
  const middlewareEnhancer = applyMiddleware(...[mRegistry.middleware]);

  const composeEnhancers =
    (isDev &&
      typeof window !== 'undefined' &&
      (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
    compose;

  const store = legacy_createStore(
    rRegistry.reducer,
    {},
    composeEnhancers(middlewareEnhancer)
  ) as Store;

  const addMiddleware = mRegistry.add;
  const addReducer = (id: string, reducer: Reducer) => {
    const remove = rRegistry.add(id, reducer);

    store.dispatch({ type: '__cruxRegistry/ADD_REDUCER', payload: { id } });

    return remove;
  };

  return { addMiddleware, addReducer, ...store };
}
