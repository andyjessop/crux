import { merge } from "@crux/utils";
import type { RecursivePartial } from "@crux/utils";
import { slice } from "./slice";

export function simpleSlice<S>(initialState: S, name?: string) {
  return slice({
    set: (state: S, payload: RecursivePartial<S>) => merge<S>(state, payload),
  }, { initialState, name }, merge);
}