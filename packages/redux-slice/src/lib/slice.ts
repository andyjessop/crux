import { generateRandomId } from "@crux/string-utils";
import { AnyAction } from "redux";

export function slice<T extends Record<string, (state: S, payload?: any) => S>, S = any>(config: T, { initialState, name }: { initialState: S, name?: string; }) {
  const keys = Object.keys(config) as unknown as (keyof T & string)[];
  const id = name || generateRandomId(20);

  return {
    actions: keys
      .reduce((acc, key) => {
        const type = getType(key);

        const actionCreator = function<K extends keyof T & string>(payload?: Parameters<T[K]>[1]) {
          return {
            payload,
            type,
          }
        };

        actionCreator.type = type;

        acc[key] = actionCreator;

        return acc;
      }, {} as { [K in keyof T]: Parameters<T[K]>[1] extends undefined ?
        { (): { payload: Parameters<T[K]>[1]; type: K; }; name: K; type: K; } :
        { (payload: Parameters<T[K]>[1]): { payload: Parameters<T[K]>[1]; type: K; }; name: K; type: K; }
      }),

    reducer: (state: S | undefined, action: AnyAction) => {
      const [namespace, ...rest] = action.type.split('/');

      const key = rest.join('/');

      if (namespace !== id || !config[key]) {
        return state ?? initialState;
      }

      return config[key](state || initialState, action['payload']);
    },
  }

  function getType(key: keyof T & string) {
    return `${id}/${key}`;
  } 
}