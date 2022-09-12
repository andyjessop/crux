import { isPlainObject } from "./object";

export type RecursivePartial<T> = {
  [P in keyof T]?:
    T[P] extends (infer U)[] ? RecursivePartial<U>[] :
    T[P] extends object ? RecursivePartial<T[P]> :
    T[P];
};

export type Merge<T extends Record<string, any>> = (dest: T, source: RecursivePartial<T>) => T; 

export function merge<T extends Record<string, any>>(dest: T, source: RecursivePartial<T>): T {
  const obj = { ...dest } as Record<string, any>;

  for (const [key, val] of Object.entries(source)) {
    if (Array.isArray(val)) {
      obj[key] = [...val];
    } else if (isPlainObject(val)) {
      obj[key] = { ...merge(obj[key], source[key] as RecursivePartial<T>) };
    } else {
      obj[key] = val;
    }
  }

  return obj as T;
}