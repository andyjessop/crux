import { State } from "../types";
import { Action } from '@crux/redux-types';

export function createReducer(initialState: Record<string, State<any, any>>) {
  return function reducer(state: Record<string, State<any, any>>, action: Action<State<any, any>>) {
    const currentState = state || initialState;

    if (action.type === '__crux-query__') {
      return {
        ...currentState,
        [action.meta.id]: {
          ...currentState[action.meta.id],
          ...action.payload,
        }
      };
    }
  
    return state ||initialState;
  }
}
