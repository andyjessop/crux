import { createSlice } from "@crux/redux-slice";
import { merge } from "@crux/utils";
import type { Cache } from "../../shared/cache/types";
import { DARK_MODE_CACHE_KEY } from "./dark-mode.config";
import { isBoolean } from "./utils/is-boolean";

export type DarkModeState = {
  isDark: boolean;
}

export type DarkModeSlice = ReturnType<typeof createDarkModeSlice>['api'];

export function createDarkModeSlice(cache: Cache) {
  const initialState = {
    isDark: valueFromCache(),
  };

  return createSlice('darkMode', initialState, {
    setDarkMode: (state: DarkModeState, payload: boolean) => merge(state, {
      isDark: payload
    }),
  });

  function valueFromCache() {
    const cachedDarkMode = cache.get(DARK_MODE_CACHE_KEY);

    return isBoolean(cachedDarkMode) ? cachedDarkMode : false;
  }
}