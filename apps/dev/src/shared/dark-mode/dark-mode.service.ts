import './dark-mode.scss';
import type { DarkMode } from './types';
import type { Cache } from '../../shared/cache/types';

export const DARK_MODE_CACHE_KEY = 'crux-dev-dark-mode';

export function createDarkModeService(cache: Cache): DarkMode {
  set(fromCache());

  return {
    isDark,
    set,
  };

  function fromCache() {
    const cachedDarkMode = cache.get(DARK_MODE_CACHE_KEY);

    return isBoolean(cachedDarkMode) ? cachedDarkMode : false;
  }

  function isDark() {
    return document.body.classList.contains('dark');
  }

  function set(dark?: boolean) {
    if (dark) {
      cache.set(DARK_MODE_CACHE_KEY, true);
      return document.body.classList.add('dark');
    }
    
    cache.set(DARK_MODE_CACHE_KEY, false);
    return document.body.classList.remove('dark');
  }
}

function isBoolean(val: unknown): val is boolean {
  return val === true || val === false;
}