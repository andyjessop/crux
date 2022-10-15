import { createEventEmitter, EventEmitter } from "@crux/event-emitter";
import { Action, Dispatch, MiddlewareAPI } from "@crux/redux-types";

export function createSlice<T extends Record<keyof T, unknown>>() {
  return function withConfig<N extends string, S>(
    name: N,
    initialState: S,
    config: {
      [K in keyof T]: IsTuple<T[K]> extends true
        ? (state: S, ...params: Extract<T[K], readonly unknown[]>) =>  S | Handler<T>
        : (state: S, param: T[K]) => S | Handler<T>
    },
  ) {
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
    const actions = keys
      .reduce((acc, key) => {
        const actionCreator = function(...params: any[]) {
          return {
            payload: config[key].length > 2 ? params : params[0],
            type: actionTypes[key],
          }
        } as any;

        actionCreator.type = actionTypes[key];

        acc[key] = actionCreator;

        return acc;
      }, {} as {
        [K in keyof T]: T[K] extends undefined
          ? {
            (): {
              payload: undefined;
              type: `${N}/${K & string}`;
            }; name: K; type: `${N}/${K & string}`; }
          : IsTuple<T[K]> extends true
            ? { (...params: Extract<T[K], readonly unknown[]>): {
                payload: T[K];
                type: `${N}/${K & string}`;
              }; name: K; type: `${N}/${K & string}`; }
            : { (param: T[K]): {
              payload: T[K];
              type: `${N}/${K & string}`;
            }; name: K; type: `${N}/${K & string}`; }
      });

    type Events = {
      [K in keyof T]: T[K];
    };

    /**
     * Create an API from the actions object. The API provides the same parameters as the actions, but
     * calls dispatch instead of just creating an action.
     */
    const api = (Object.entries(actions) as Array<[keyof T & string, (param?: any) => Action]>)
      .reduce((acc, [key, actionCreator]) => {
        acc[key] = async function<K extends keyof T & string>(
          param?: T[K]
        ) {
          if (!dispatch) {
            throw `${name} slice middleware has not yet been registered with the store. Dispatch is not available.`;
          }

          const action = actionCreator(param) as {
            payload: T[K];
            type: `${N}/${K & string}`;
          };
          
          dispatch(actionCreator(param));

          acc.emit(key, action.payload);
        } as any;

        return acc;
      }, {
        ...createEventEmitter<Events>(),
        get,
      } as {
        [P in keyof T]: IsTuple<T[P]> extends true ? (...params:Extract<T[P], readonly unknown[]>) => Promise<void> | void : (param: T[P]) => Promise<void> | void
      } & EventEmitter<Events> & { get: (key?: keyof S) => S | S[keyof S] });

    return {
      actions,
      api,
      middleware,
      reducer,
    }

    function get(key?: keyof S): S | S[keyof S] {
      if (!getState) {
        throw `${name} slice middleware has not yet been registered with the store. getState is not available.`;
      }

      const state = getState();

      return key ? state[name][key] : state[name];
    }

    function getType(key: keyof T & string): SliceActionType {
      return `${name}/${key}`;
    } 

    function isState(obj: unknown): obj is S {
      return typeof obj !== 'function';
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

      return (next: Dispatch) => (action: Action) => {
        next(action);

        if (isSliceActionType(action.type)) {
          const state = middlewareApi.getState()[name];
          const key = keysFromActionTypes[action.type];
      
          const res = config[key](state, action.payload);
          
          // If it's not a state object, then it's an effect and we should call it with the api.
          if (!isState(res)) {
            res({ api });
          }
        }
      };
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
        const res = config[key].length > 2
          ? config[key](dest, ...(action['payload'] as [any]))
          : config[key](dest, action['payload']);

        // If it's not a state object, then it's an async call. Don't handle that in the reducer.
        if (!isState(res)) {
          return dest;
        }

        return res;
      }
      
      return dest;
    }
  }
}

function inverse<T extends string, U extends string>(obj: Record<T, U>): Record<U, T> {
  const ret = {} as Record<U, T>;

  for(const key in obj){
    ret[obj[key]] = key;
  }

  return ret;
}

type ANumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

type IsTuple<Type> = Type extends readonly unknown[]
  ? Type['length'] extends ANumber
    ? true
    : false
  : false;

type Handler<T extends Record<keyof T, unknown>> = (({ api }: { api: { [P in keyof T]: IsTuple<T[P]> extends true ? (...params: Extract<T[P], readonly unknown[]>) => Promise<void> | void  : (params: T[P]) => Promise<void> | void } & EventEmitter<{
  [K in keyof T]: T[K];
}> }) => Promise<void> | void);