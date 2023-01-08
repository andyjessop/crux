import { service, slice, view } from '@crux/crux';
import { cacheService } from '../../shared/cache/cache.index';

export const darkModeSlice = slice(
  (cache) => import('./dark-mode.slice').then((m) => m.createDarkModeSlice(cache)),
  {
    deps: [cacheService],
    name: 'darkMode',
  }
);

export const darkModeService = service(
  (slice, cache) => import('./dark-mode.service').then((m) => m.darkMode(slice, cache)),
  {
    deps: [darkModeSlice, cacheService],
  }
);

export const darkModeView = view(
  () => import('./dark-mode.view').then((m) => m.createDarkModeView),
  {
    actions: darkModeService,
    data: darkModeSlice.selector,
    root: 'dark-mode-toggle',
  }
);
