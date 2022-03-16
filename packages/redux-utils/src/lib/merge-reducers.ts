import { AnyAction, Reducer } from 'redux';

/**
 * Chains multiple reducers together, returning a single reducer which passes the state and action through each
 * provided reducer in turn. This is useful, for example, for utilities that abstract reducer functionality
 * for reusability.
 *
 * @example
 *
 * const getReducer = (state, action) => ({...}) // Manages actions related to GET query
 * const postReducer = (state, action) => ({...}) // Manages actions related to POST query
 * const putReducer = (state, action) => ({...}) // Manages actions related to PUT query
 * const deleteReducer = (state, action) => ({...}) // Manages actions related to DELETE query
 *
 * // combined reducer manages all types of query for a single slice.
 * const reducer = mergeReducers([
 *  getReducer, postReducer, putReducer, deleteReducer,
 * ]);
 */
export function mergeReducers<State>(reducers: Reducer<State>[]): Reducer<State> {
  return reducers.reduce(
    (acc, reducer) => (state: State | undefined, action: AnyAction) => reducer(acc(state, action), action),

    // must cast `state as State` here because reducers are required to profide a return
    // value for State, even if the provided State is undefined.
    (state: State | undefined, action: AnyAction) => state as State,
  );
}
  