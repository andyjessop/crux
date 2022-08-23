import { legacy_createStore, applyMiddleware, compose } from 'redux';
import { middlewareRegistry, reducerRegistry } from '@crux/redux-registry'
import type { Store } from '@crux/redux-types'

export function createStore({ isDev }: { isDev?: boolean } = { isDev: true }) {
  const mRegistry = middlewareRegistry();
  const rRegistry = reducerRegistry();
  
  const addMiddleware = mRegistry.add;
  const addReducer = rRegistry.add;

  const middlewareEnhancer = applyMiddleware(...[mRegistry.middleware]);

  const composeEnhancers =
  (isDev && typeof window !== 'undefined' &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

  const store = legacy_createStore(rRegistry.reducer, {}, composeEnhancers(middlewareEnhancer)) as Store;

  return { addMiddleware, addReducer, store };
}
