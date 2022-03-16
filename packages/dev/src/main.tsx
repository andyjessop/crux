import './app/styles/reset.scss';
import './app/styles/variables.scss';
import './app/styles/base.scss';
import { configureStore } from '@reduxjs/toolkit';
import { middleware as routerMiddleware, reducer as routerReducer } from './app/modules/router';
import { createLayoutService } from './app/services/layout';
import { createDarkModeService } from './app/services/dark-mode';
import { createCacheService } from './app/services/cache';
import { createCacheMiddlware } from './app/modules/cache/middleware';
import { createDarkModeMiddlware } from './app/modules/dark-mode/middleware';

import { reducer as darkModeReducer } from './app/modules/dark-mode/slice';
import { actions as layoutActions, reducer as layoutReducer } from './app/modules/layout/slice';
import { createMounterMiddlware } from './app/modules/mounter/middleware';

const root = document.getElementById('root');

const cache = createCacheService();
const darkMode = createDarkModeService();
const cacheMiddleware = createCacheMiddlware(cache);
const darkModeMiddleware = createDarkModeMiddlware(darkMode, cache);

const base = {
  nav: nav,
  sidebar: sidebar,
};

const views = {
  users: {
    ...base,
    main: users
  }
};

const config = {
  services: {
    cache: createCacheService,
    darkMode: createDarkModeService,
  },
  routes: {
    regions: {
      
    },
  }
}

const mounterMiddleware = createMounterMiddlware(views);

const store = configureStore({
  reducer: {
    darkMode: darkModeReducer,
    layout: layoutReducer,
    router: routerReducer
  },
  middleware: [
    routerMiddleware,
    cacheMiddleware,
    darkModeMiddleware,
    mounterMiddleware,
  ]
});

const layout = createLayoutService(store, root);

// Mounter middleware
  // Select route
  // 

store.dispatch({
  type: 'app/init',
})

store.dispatch(layoutActions.setRegion({
  main: true,
  nav: true,
  sidebar: true,
}));

function nav() {/**/}
function sidebar() {/**/}
function users() {/**/}