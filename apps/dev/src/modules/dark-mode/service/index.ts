import './dark-mode.scss';
import type { DarkMode } from './types';
import type { Cache } from '../../../services/cache/types';

export const DARK_MODE_CACHE_KEY = 'dark-mode';

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
      return document.body.classList.add('dark');
    }
    
    return document.body.classList.remove('dark');
  }
}

function isBoolean(val: unknown): val is boolean {
  return val === true || val === false;
}