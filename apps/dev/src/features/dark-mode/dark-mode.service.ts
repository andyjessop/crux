import type { Cache } from "../../shared/cache/types";
import { DARK_MODE_CACHE_KEY } from "./dark-mode.config";
import type { DarkModeSlice } from "./dark-mode.slice";

export function darkMode(darkModeSlice: DarkModeSlice, cache: Cache) {
  return {
    set,
    toggle,
  };

  function set(isDark: boolean) {
    cache.set(DARK_MODE_CACHE_KEY, isDark);
  
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
      
    darkModeSlice.setDarkMode(isDark);
  }
  
  function toggle() {
    const isDark = !darkModeSlice.getState().isDark;

    cache.set(DARK_MODE_CACHE_KEY, isDark);

    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
      
    darkModeSlice.setDarkMode(isDark);
  }
}