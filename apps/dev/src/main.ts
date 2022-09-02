import './main.css';
import { createApp, LogLevel } from '@crux/app';
import type { Logger } from '@crux/app';
import { selectLayoutData } from './layout/layout.selectors';
import { html, render } from 'lit-html';

main();

async function main() {
  const root = document.getElementById('root');

  if (!root) {
    throw 'No root found!!';
  }
  
  // If we're in development, start the mock server. This starts a ServiceWorker
  // which intercepts fetch requests and returns mocks according to the contents
  // of ./shared/mocks/handlers. See https://mswjs.io/ for more details.
  if (import.meta.env.DEV) {    
    const { createServer } = await import('./shared/mock/server');

    (await createServer( import.meta.env.VITE_API_BASE_URL)).start({ onUnhandledRequest: "bypass", waitUntilReady: true });
  }

  await createApp({
    /**
     * MODULES
     * =======
     */
    modules: {
      auth: {
        deps: ['auth'],
        factory: () => import('./features/auth/auth.module').then(mod => mod.createAuthModule),
      },
      darkMode: {
        deps: ['darkMode'],
        factory: () => import('./shared/dark-mode/dark-mode.module').then(mod => mod.createDarkModeModule),
      },
      data: {
        deps: ['usersApi'],
        factory: () => import('./shared/data/data.module').then(mod => mod.createDataModule),
      },
      router: {
        deps: ['cache'],
        factory: () => import('./shared/router/router.module').then(mod => mod.createRouterModule)
      },
      signupForm: {
        deps: ['auth', 'signupForm'],
        factory: () => import('./features/sign-up-form/sign-up-form.module').then(mod => mod.createSignupFormModule)
      },
      users: {
        deps: ['data.users'],
        factory: () => import('./features/users/user.module').then(mod => mod.createUserModule),
      },
    },

    /**
     * LAYOUT
     * ======
     */
    layout: {
      module: {
        factory: () => import('./layout/layout.module').then(mod => mod.createLayoutModule),
      },
      view: {
        selectData: selectLayoutData,
        factory: () => import('./layout/layout.view').then(mod => mod.createLayoutView),
      }
    },

    /**
     * ROOT
     * ====
     */
    root,

    /**
     * SERVICES
     * ========
     */
    services: {
      asyncCache: { factory: () => import('./shared/cache/async-cache.service').then(mod => mod.createAsyncCacheService) },
      authApi: { factory: () => import('./features/auth/api/api').then(mod => mod.createAuthApi), deps: ['asyncCache', 'env'] },
      auth: { factory: () => import('./features/auth/services/auth.service').then(mod => mod.createAuth), deps: ['authApi'] },
      cache: { factory: () => import('./shared/cache/cache.service').then(mod => mod.createCacheService) },
      darkMode: { factory: () => import('./shared/dark-mode/dark-mode.service').then(mod => mod.createDarkModeService), deps: ['cache'] },
      env: { factory: () => import('./shared/env/env.service').then(mod => mod.env) },
      featureFlags: { factory: () => import('./shared/feature-flags/feature-flags.service').then(mod => mod.createFeatureFlagsService) },
      reporting: { factory: () => import('./shared/logging/logging.service').then(mod => mod.createReportingService) },
      signupForm: { factory: () => import('./features/sign-up-form/sign-up-form.service').then(mod => mod.signupForm) },
      usersApi: { factory: () => import('./shared/api/users-api.service').then(mod => mod.createUsersApiService) },
    },

    /**
     * VIEWS
     * =====
     */
    views: {}
  }, { logger: createLogger('debug') });
}

export function createLogger(initialLevel: keyof typeof LogLevel): Logger {
  return {
    log: (level: keyof typeof LogLevel, data: string) => {
      if (LogLevel[level] <= LogLevel[initialLevel]) {
        const { data: logData, message } = JSON.parse(data) as any;
        console.info(message, logData);
      }
    }
  }
}