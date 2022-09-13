import type { CruxContext } from "@crux/app";
import type { Cache } from "../../shared/cache/types";
import { selectDarkModeData } from "./dark-mode.selectors";
import { createDarkModeSlice } from "./dark-mode.slice";

export function createDarkModeModule({ roots }: CruxContext, cache: Cache) {
  const { actions, api, middleware, reducer } = createDarkModeSlice(cache);

  return {
    actions,
    middleware,
    reducer,
    services: {
      api: {
        factory: () => Promise.resolve(() => api),
      },
    },
    views: {
      toggle: {
        selectActions: () => api,
        selectData: selectDarkModeData,
        factory: () => import('./dark-mode.view').then(mod => mod.createDarkModeView),
        root: 'dark-mode-toggle',
      }
    }
  };
}