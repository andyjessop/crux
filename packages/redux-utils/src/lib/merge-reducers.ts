import { AnyAction, Reducer } from 'redux';

export const mergeReducers = (reducers: Reducer[]) => (
  <S>(state: S, action: AnyAction) => (
    reducers.reduce((accumulatedState, reducer) => (
      Object.assign({}, accumulatedState, reducer(state, action))
    ), state || {})
  )
);
  