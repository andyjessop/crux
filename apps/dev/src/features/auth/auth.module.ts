import type { CruxContext } from '@crux/app';
import type { AuthAPI } from './api/api';
import { createAuth } from './domain/auth';
import { createAuthMiddleware } from './middleware';
import { authSlice } from './slice';
import { selectUserNavActions, selectUserNavData } from './views/user-nav/user-nav.selectors';

export async function createAuthModule({ dispatch }: CruxContext, api: AuthAPI) {
  const auth = await createAuth(api);
  const { actions, reducer } = authSlice();
  const middlewares = [createAuthMiddleware(auth, actions)];

  return {
    actions,
    middlewares,
    reducer,
    views: {
      userNav: {
        selectActions: () => selectUserNavActions(auth),
        selectData: selectUserNavData,
        factory: () => import('./views/user-nav/user-nav.view').then(mod => mod.createUserNavView),
        root: 'user-nav',
      }
    }
  };
}

