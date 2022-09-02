import type { CruxContext } from '@crux/app';
import type { User } from './api/types';
import type { AuthService, StateChangeData } from './services/auth.service';
import { authSlice } from './auth.slice';
import { selectUserNavActions, selectUserNavData } from './views/user-nav/user-nav.selectors';

export async function createAuthModule({ dispatch }: CruxContext, auth: AuthService) {
  const { actions, reducer } = authSlice('auth');

  return {
    actions,
    create,
    destroy,
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

  function create() {
    auth.on('user', setUser);
    auth.on('stateChange', stateChange);
  }

  function destroy() {
    auth.off('user', setUser);
    auth.off('stateChange', stateChange);
  }

  function setUser(data: User) {
    dispatch(actions.set({ user: data }));
  }

  function stateChange(data: StateChangeData) {
    dispatch(actions.set({ machineState: data.current }));
  }
}

