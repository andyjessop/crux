import { createEventEmitter, EventEmitter } from '@crux/event-emitter';
import { Action, Dispatch, MiddlewareAPI } from '@crux/redux-types';

type ANumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

type DropFirst<T extends unknown[]> = T extends [any, ...infer U]
  ? U['length'] extends ANumber
    ? U
    : [U]
  : never;

export function createSlice<
  T extends Record<keyof T, (state: S, ...params: any[]) => any>,
  N extends string = any,
  S = any
>(name: N, initialState: S, config: T) {
  let dispatch: Dispatch;
  let getState: () => any;
  type SliceActionType = `${N}/${keyof T & string}`;

  const keys = Object.keys(config) as unknown as (keyof T & string)[];

  const actionTypes = keys.reduce((acc, key) => {
    acc[key] = getType(key) as SliceActionType;

    return acc;
  }, {} as Record<keyof T & string, SliceActionType>);

  const keysFromActionTypes = inverse(actionTypes);

  /**
   * Build the slice's action creators.
   */
  const actions = keys.reduce(
    (acc, key) => {
      const actionCreator = function (...params: any[]) {
        return {
          payload: config[key].length > 2 ? params : params[0],
          type: actionTypes[key],
        };
      } as any;

      actionCreator.type = actionTypes[key];

      acc[key] = actionCreator;

      return acc;
    },
    {} as {
      [K in keyof T]: T[K] extends undefined
        ? {
            (): {
              payload: undefined;
              type: `${N}/${K & string}`;
            };
            name: K;
            type: `${N}/${K & string}`;
          }
        : {
            (...params: DropFirst<Parameters<T[K]>>): {
              payload: T[K];
              type: `${N}/${K & string}`;
            };
            name: K;
            type: `${N}/${K & string}`;
          };
    }
  );

  type Events = {
    [K in keyof T]: T[K];
  };

  /**
   * Create an API from the actions object. The API provides the same parameters as the actions, but
   * calls dispatch instead of just creating an action.
   */
  const api = (
    Object.entries(actions) as Array<[keyof T & string, (param?: any) => Action]>
  ).reduce(
    (acc, [key, actionCreator]) => {
      acc[key] = function <K extends keyof T & string>(...params: DropFirst<Parameters<T[K]>>) {
        if (!dispatch) {
          throw `${name} slice middleware has not yet been registered with the store. Dispatch is not available.`;
        }

        const action = actionCreator(...params) as {
          payload: T[K];
          type: `${N}/${K & string}`;
        };

        const before = getSliceState();

        dispatch(action);

        const after = getSliceState();

        acc.emit(key, action.payload);

        return before !== after;
      } as any;

      return acc;
    },
    {
      ...createEventEmitter<Events>(),
      getState: getSliceState,
    } as {
      [P in keyof T]: (...params: DropFirst<Parameters<T[P]>>) => boolean;
    } & { getState: () => S } & EventEmitter<Events>
  );

  return {
    actions,
    api,
    middleware,
    reducer,
  };

  function getSliceState(): S {
    if (!getState) {
      throw `${name} slice middleware has not yet been registered with the store. getState is not available.`;
    }

    return getState()[name] as S;
  }

  function getType(key: keyof T & string): SliceActionType {
    return `${name}/${key}`;
  }

  function isSliceActionType(type: string): type is SliceActionType {
    return keysFromActionTypes[type as SliceActionType] !== undefined;
  }

  function middleware(middlewareApi: MiddlewareAPI) {
    if (!getState) {
      getState = middlewareApi.getState;
    }

    if (!dispatch) {
      dispatch = middlewareApi.dispatch;
    }

    return (next: Dispatch) => (action: Action) => next(action);
  }

  function reducer(state: S | undefined, action: Action): S {
    const [namespace] = action.type.split('/');
    const dest = state || initialState;

    if (isSliceActionType(action.type)) {
      const key = keysFromActionTypes[action.type];

      if (namespace !== name || !config[key]) {
        return state ?? initialState;
      }

      // Spread payload into handler, but only if the config handler is expecting more than one argument.
      const res =
        config[key].length > 2
          ? config[key](dest, ...(action['payload'] as [any]))
          : config[key](dest, action['payload']);

      return res;
    }

    return dest;
  }
}

function inverse<T extends string, U extends string>(obj: Record<T, U>): Record<U, T> {
  const ret = {} as Record<U, T>;

  for (const key in obj) {
    ret[obj[key]] = key;
  }

  return ret;
}
