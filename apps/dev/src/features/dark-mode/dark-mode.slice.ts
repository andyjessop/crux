import { createSlice } from "@crux/redux-slice";
import type { ApiOf } from '@crux/redux-slice';
import { merge } from "@crux/utils";
import type { Cache } from "../../shared/cache/types";

export const DARK_MODE_CACHE_KEY = 'crux-dev-dark-mode';

export type DarkModeState = {
  isDark: boolean;
}

export type DarkModeSlice = {
  set: boolean | undefined,
  setState: boolean,
  toggle: void,
};

export type DarkModeAPI = ApiOf<DarkModeSlice>;

export function createDarkModeSlice(cache: Cache) {
  const initialState = {
    isDark: valueFromCache(),
  };

  return createSlice<DarkModeSlice>()('darkMode', initialState, {
    set: (state, isDark) => async ({ api }) => {
      cache.set(DARK_MODE_CACHE_KEY, isDark);
  
      if (isDark) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
        
      await api.setState(isDark);
    },
    setState: (state, payload: boolean) => merge(state, {
      isDark: payload
    }),
    toggle: (state) => async ({ api }) => {
      const isDark = !state.isDark;

      cache.set(DARK_MODE_CACHE_KEY, isDark);
  
      if (isDark) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
        
      await api.setState(isDark);
    },
  });

  function valueFromCache() {
    const cachedDarkMode = cache.get(DARK_MODE_CACHE_KEY);

    return isBoolean(cachedDarkMode) ? cachedDarkMode : false;
  }
}

function isBoolean(val: unknown): val is boolean {
  return val === true || val === false;
}