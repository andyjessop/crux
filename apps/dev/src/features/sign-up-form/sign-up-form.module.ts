import type { CruxContext } from '@crux/app';
import { createSignupFormSlice } from './sign-up-form.slice';
import { selectSignupFormActions, selectSignupFormData } from './sign-up-form.selectors';
import type { AuthService, States } from '../auth/auth.slice';

export async function createSignupFormModule(auth: AuthService) {
  const { actions, api, middleware, reducer } = createSignupFormSlice(auth, 'signupForm');

  return {
    actions,
    middleware,
    reducer,
    services: {
      api: {
        factory: () => Promise.resolve(() => api),
      },
    },
    views: {
      signupForm: {
        selectActions: () => selectSignupFormActions(api),
        selectData: selectSignupFormData,
        factory: () => import('./sign-up-form.view').then(mod => mod.createSignupFormView),
        root: 'sign-up-form'
      },
    }
  };
}

