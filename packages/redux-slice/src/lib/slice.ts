import { createEventEmitter, EventEmitter } from "@crux/event-emitter";
import { Action, Dispatch, MiddlewareAPI } from "@crux/redux-types";

export const createSlice = 
  <T extends Record<keyof T, unknown>>() => <N extends string, S>(
    name: N,
    initialState: S,
    config: {
      [K in keyof T]: (state: S, param: T[K]) => 
        S |
        (({ api }: { api: { [P in keyof T]: (param: T[P]) => Promise<void> }  & EventEmitter<{
          [K in keyof T]: T[K];
        }> }) => Promise<void>)
    },
) => {
  let dispatch: Dispatch;
  type SliceActionType = `${N}/${keyof T & string}`;

  const keys = Object.keys(config) as unknown as (keyof T & string)[];

  const actionTypes = keys.reduce((acc, key) => {
    acc[key] = getType(key) as SliceActionType;

    return acc;
  }, {} as Record<keyof T & string, SliceActionType>);

  const keysFromActionTypes = inverse(actionTypes);

  const actions = keys
    .reduce((acc, key) => {
      const actionCreator = function<K extends keyof T>(param: T[K]) {
        return {
          payload: param,
          type: actionTypes[key],
        }
      };

      actionCreator.type = actionTypes[key];

      // eslint-disable-next-line
      // @ts-ignore
      acc[key] = actionCreator;

      return acc;
    }, {} as {
      [K in keyof T]: T[K] extends undefined
        ? {
          (): {
            payload: undefined;
            type: `${N}/${K & string}`;
          }; name: K; type: `${N}/${K & string}`; }
        : {
          (param: T[K]): {
            payload: T[K];
            type: `${N}/${K & string}`;
          }; name: K; type: `${N}/${K & string}`; }
    });

  type Events = {
    [K in keyof T]: T[K];
  };

  const api = (Object.entries(actions) as Array<[keyof T & string, (param?: any) => Action]>)
    .reduce((acc, [key, actionCreator]) => {
      // eslint-disable-next-line
      // @ts-ignore
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
      }

      return acc;
    }, { ...createEventEmitter<Events>() } as {
      [P in keyof T]: (param: T[P]) => Promise<void>
    } & EventEmitter<Events>);

  const middleware = (middlewareApi: MiddlewareAPI) => {
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
  };

  return {
    actions,

    api,

    middleware,

    reducer: (state: S | undefined, action: Action) => {
      const [namespace] = action.type.split('/');
      const dest = state || initialState;

      if (isSliceActionType(action.type)) {
        const key = keysFromActionTypes[action.type];
  
        if (namespace !== name || !config[key]) {
          return state ?? initialState;
        }
  
        const res = config[key](dest, action['payload']);
  
        // If it's not a state object, then it's an async call. Don't handle that in the reducer.
        if (!isState(res)) {
          return dest;
        }
  
        return res;
      }
      
      return dest;
    },
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
}

function inverse<T extends string, U extends string>(obj: Record<T, U>): Record<U, T> {
  const ret = {} as Record<U, T>;

  for(const key in obj){
    ret[obj[key]] = key;
  }

  return ret;
}