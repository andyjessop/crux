import { combineReducers, Reducer } from 'redux';

export function reducerRegistry() {
  const reducers = new Map<string, Reducer>();
  let reducer: Reducer;

  return {
    getReducer,
    register,
  };

  function getReducer() {
    return reducer;
  }

  function register(id: string, newReducer: Reducer) {
    reducers.set(id, newReducer);

    updateReducer();

    return function unregisterReducer() {
      reducers.delete(id);

      updateReducer();
    }
  }

  function updateReducer() {
    reducer = combineReducers(Object.fromEntries(reducers));
  }
}