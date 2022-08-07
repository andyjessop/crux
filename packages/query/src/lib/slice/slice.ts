import { generateRandomId } from "@crux/string-utils";
import { Action } from "../types";

export function slice<T extends Record<string, (state: S, payload?: any) => S>, S>(config: T, { initialState, name }: { initialState: S, name?: string; }) {
  const keys = Object.keys(config) as unknown as (keyof T & string)[];
  const id = name || generateRandomId(20);

  return {
    actions: keys
      .reduce((acc, key) => {
        acc[key] = function<K extends keyof T & string>(payload?: Parameters<T[K]>[1]) {
          return {
            payload,
            type: getType(key),
          }
        };

        return acc;
      }, {} as { [K in keyof T]: Parameters<T[K]>[1] extends undefined ?
        { (): { payload: Parameters<T[K]>[1]; type: K; }; name: K; } :
        { (payload: Parameters<T[K]>[1]): { payload: Parameters<T[K]>[1]; type: K; }; name: K; }
      }),

    getType,

    reducer: (state: S | undefined, action: Action) => {
      const [namespace, ...rest] = action.type.split('/');

      if (namespace !== id) {
        return state ?? initialState;
      }

      const key = rest.join('/');

      return config[key]?.(state || initialState, action['payload']);
    },
  }

  function getType(key: keyof T & string) {
    return `${id}/${key}`;
  } 
}