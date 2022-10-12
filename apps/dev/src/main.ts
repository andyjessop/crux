import './main.css';
import { createApp, LogLevel } from '@crux/app';
import type { Logger } from '@crux/app';
import { selectLayoutData } from './layout/layout.selectors';
import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/switch/switch.js';
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';

// Set the base path to the folder you copied Shoelace's assets to
setBasePath('/path/to/shoelace/dist');

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

  const { services } = await createApp({
    /**
     * MODULES
     * =======
     */
    modules: {
      auth: {
        deps: ['authApi'],
        factory: () => import('./features/auth/auth.module').then(mod => mod.createAuthModule),
      },
      darkMode: {
        deps: ['cache'],
        factory: () => import('./features/dark-mode/dark-mode.module').then(mod => mod.createDarkModeModule),
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
        deps: ['auth.api'],
        enabled: (state: any) => state.auth.user === null,
        factory: () => import('./features/sign-up-form/sign-up-form.module').then(mod => mod.createSignupFormModule),
      },
      toast: {
        deps: [],
        factory: () => import('./features/toaster/toaster.module').then(mod => mod.createToastModule),
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
      cache: { factory: () => import('./shared/cache/cache.service').then(mod => mod.createCacheService) },
      env: { factory: () => import('./shared/env/env.service').then(mod => mod.env) },
      featureFlags: { factory: () => import('./shared/feature-flags/feature-flags.service').then(mod => mod.createFeatureFlagsService) },
      reporting: { factory: () => import('./shared/logging/logging.service').then(mod => mod.createReportingService) },
      usersApi: { factory: () => import('./shared/api/users-api.service').then(mod => mod.createUsersApiService) },
    },
  });

  (window as any).services = services;
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