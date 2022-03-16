import './dark-mode.scss';
import { DarkMode } from './types';

export function createDarkModeService(initial?: boolean): DarkMode {
  set(initial);

  return {
    set,
  };

  function set(dark?: boolean) {
    if (dark) {
      return document.body.classList.add('dark');
    }
    
    return document.body.classList.remove('dark');
  }
}