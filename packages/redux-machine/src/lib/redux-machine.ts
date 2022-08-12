import { slice } from '@crux/redux-slice';
import { DispatchActionOrThunk } from '@crux/redux-types';
import { Dispatch } from 'redux';

export function machine<T extends Config<D>, D extends DefaultData>(name: string, config: T, data: D) {   
  // Flatten config to get actions with key, e.g. 'off/switchOn': (state, payload) => state
  const actionsConfig = 
    Object.entries(config).reduce((acc, [stateKey, stateVal]) => {
      Object.entries(stateVal).forEach(([actionKey, actionFn]) => {
        const key = `${stateKey}/${actionKey}`;

        acc[key] = actionFn;
      });

      return acc;
    }, {} as ActionConfig<D>);

  // Create new slice from actions
  const { reducer } = slice(actionsConfig, { initialState: data, name: name });

  // Create API
  const actionKeys = 
    [...new Set(Object.values(config).flatMap(state => Object.keys(state)))] as Array<keyof Nested<T>>;

  const actionMethods = actionKeys
    .reduce((acc, actionKey) => {
      acc[actionKey] = function(payload?: any): (dispatch: DispatchActionOrThunk, getState: () => any) => void {
        return thunk(actionKey, payload);
      };

      return acc;
    }, {} as Actions<T>);

  return {
    actions: actionMethods,
    reducer,
  };

  function thunk(actionKey: keyof Nested<T>, payload?: any): (dispatch: DispatchActionOrThunk, getState: () => any) => void {
    return function(dispatch, getState) {
      const currentState = getState()[name].state;

      if (!config[currentState]?.[actionKey as keyof ActionConfig<D>]) {
        return;
      }

      dispatch({
        type: `${name}/${currentState}/${actionKey as string}`,
        payload,
      })
    }
  }
}

type DefaultData = {
  state: string;
}

type ActionConfig<Data> = Record<string, (state: Data, payload?: any) => Data>;

type Config<Data extends DefaultData = DefaultData> = {
  [key: string]: ActionConfig<Data>;
}

type UnionToIntersection<U> = 
  (U extends any ? (k: U)=>void : never) extends ((k: infer I)=>void) ? I : never

type Nested<T> = UnionToIntersection<T[keyof T]>

type Params<T> = { 
  [K in keyof Nested<T>]: 
    (Parameters<
      Nested<T>[K] extends infer U extends (...args: any) => any ? U : never
    >) 
};

/**
 * Convert from T, which is:
 * 
 * {
 *   [state1]: {
 *    [action1]: (state: Data, payload: Payload) => Data
 *    [action2]: (state: Data) => Data
 *   },
 *   [state2]: {
 *    [action2]: (state: Data) => Data
 *   },
 * } 
 * 
 * to:
 * 
 * {
 *   [action1]: (payload: Payload) => Data
 *   [action2]: () => Data
 * } 
 */
export type Actions<T> = {
  [K in keyof Nested<T>]: Params<T>[K][1] extends undefined
    ? () => (dispatch: DispatchActionOrThunk, getState: () => any) => void
    : (payload: Params<T>[K][1]) => (dispatch: DispatchActionOrThunk, getState: () => any) => void
}