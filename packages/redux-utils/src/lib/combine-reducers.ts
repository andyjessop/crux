import { AnyAction, Reducer } from 'redux';

export function combineReducers(reducers: Record<string, Reducer>) {
  // First get an array with all the keys of the reducers (the reducer names)
  const reducerKeys = Object.keys(reducers);

  return function reducer(state: any = {}, action: AnyAction) {
    // This is the object we are going to return.
    const nextState: any = {};

    // Loop through all the reducer keys
    for (let i = 0; i < reducerKeys.length; i++) {
      // Get the current key name
      const key = reducerKeys[i];
      // Get the current reducer
      const currentReducer = reducers[key];
      // Get the the previous state
      const previousStateForKey = state[key];
      // Get the next state by running the reducer
      const nextStateForKey = currentReducer(previousStateForKey, action);
      // Update the new state for the current reducer
      nextState[key] = nextStateForKey;
    }

    return nextState;
  };
}
