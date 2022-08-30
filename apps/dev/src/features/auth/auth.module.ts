import type { CruxContext } from '@crux/app';
import type { AuthAPI } from './api/api';
import { createAuth } from './domain/auth';
import { authSlice } from './slice';
import { selectUserNavActions, selectUserNavData } from './views/user-nav/user-nav.selectors';

export async function createAuthModule({ dispatch }: CruxContext, api: AuthAPI) {
  const auth = await createAuth(api);
  const { actions, reducer } = authSlice();

  auth.on('user', data => dispatch(actions.setUser(data)));
  auth.on('stateChange', data => dispatch(actions.setMachineState(data.current)));

  return {
    actions,
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

