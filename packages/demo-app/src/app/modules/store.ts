import { Crux, CruxHooks } from "src/lib/crux/types";
import type { State } from "../domain/router";
import type { Store } from "../services/store";

export function createStoreModule(crux: Crux, store: Store<State>) {
  return {
    hooks: [
      [CruxHooks.BeforeModule, store.pause],
      [CruxHooks.AfterMounter, store.resume],
    ]
  }
}