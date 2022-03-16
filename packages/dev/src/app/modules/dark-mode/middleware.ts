import { AnyAction, Dispatch, MiddlewareAPI } from '@reduxjs/toolkit';
import { Cache } from '../../services/cache/types';
import { DarkMode } from '../../services/dark-mode/types';
import { actions } from './slice';

export const DARK_MODE_CACHE_KEY = 'dark-mode';

export function createDarkModeMiddlware(darkMode: DarkMode, cache: Cache) {
  return (api: MiddlewareAPI) => (next: Dispatch<AnyAction>) => (action: AnyAction) => {
    const { payload, type } = action;

    if (type === 'darkMode/set') {
      cache.set(DARK_MODE_CACHE_KEY, payload);
      darkMode.set(payload);
    }

    next(action);

    if (type === 'app/init') {
      const isDark = fromCache();

      darkMode.set(isDark);
      api.dispatch(actions.set(isDark));
    }
  };

  function fromCache() {
    const cachedDarkMode = cache.get(DARK_MODE_CACHE_KEY);

    return isBoolean(cachedDarkMode) ? cachedDarkMode : false;
  }
}

function isBoolean(val: unknown): val is boolean {
  return val === true || val === false;
}