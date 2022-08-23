import { createApp, LogLevel } from '@crux/app';
import type { Logger } from '@crux/app';
import { selectLayout } from './modules/layout/redux/selectors';
import { selectToggleButtonActions, selectToggleButtonData } from './modules/toggle-button/redux/selectors';

main();

async function main() {
  const root = document.getElementById('root');

  if (!root) {
    throw 'No root found!!';
  }
  
  const app = await createApp({
    modules: {
      darkMode: {
        deps: ['darkMode', 'cache'],
        enabled: () => true,
        factory: () => import('./modules/dark-mode/redux').then(mod => mod.createDarkModeRedux),
      },
      data: {
        deps: ['data'],
        enabled: () => true,
        factory: () => import('./modules/data/redux').then(mod => mod.createDataRedux),
      },
      router: {
        enabled: () => true,
        factory: () => import('./modules/router/redux').then(mod => mod.createRouterRedux)
      },
      layout: {
        enabled: () => true,
        factory: () => import('./modules/layout/redux').then(mod => mod.createLayoutRedux),
      },
      toggleButton: {
        enabled: () => true,
        factory: () => import('./modules/toggle-button/redux/slice').then(mod => mod.createToggleButtonRedux)
      }
    },
    root,
    services: {
      cache: { factory: () => import('./services/cache').then(mod => mod.createCacheService) },
      darkMode: { factory: () => import('./modules/dark-mode/service').then(mod => mod.createDarkModeService), deps: ['cache'] },
      data: { factory: () => import('./services/data').then(mod => mod.createDataService) },
      usersApi: { factory: () => import('./services/api/users').then(mod => mod.createUsersApiService) },
      usersData: { factory: () => import('./services/data/users').then(mod => mod.usersDataService), deps: ['data', 'usersApi'] }
    },
    views: {
      layout: {
        selectData: selectLayout,
        factory: () => import('./modules/layout/views/layout').then(mod => mod.createLayoutView),
      },
      toggleButton: {
        root: 'top-left',
        selectActions: selectToggleButtonActions,
        selectData: selectToggleButtonData,
        factory: () => import('./modules/toggle-button/views/toggle-button').then(mod => mod.createToggleButtonView),
      }
    }
  }, { logger: createLogger('debug') });
}

export function createLogger(initialLevel: keyof typeof LogLevel): Logger {
  return {
    log: (level: keyof typeof LogLevel, data: string) => {
      if (LogLevel[level] <= LogLevel[initialLevel]) {
        console.log(data);
      }
    }
  }
}