import type { CruxContext } from '@crux/app';
import { createAuthSlice } from './auth.slice';
import { selectUserNavActions, selectUserNavData } from './views/user-nav/user-nav.selectors';
import type { AuthAPI } from './api/api';

export async function createAuthModule(auth: AuthAPI) {
  const { actions, api, middleware, reducer } = createAuthSlice('auth', auth);

  return {
    actions,
    api,
    create,
    middleware,
    reducer,
    views: {
      userNav: {
        selectActions: () => selectUserNavActions(api),
        selectData: selectUserNavData,
        factory: () => import('./views/user-nav/user-nav.view').then(mod => mod.createUserNavView),
        root: 'user-nav',
      }
    }
  };

  function create() {
    api.init();
  }
}

