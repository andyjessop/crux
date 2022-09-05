import type { CruxContext } from '@crux/app';
import type { AuthService } from '../auth/services/auth.service';
import { initialState, signupFormSlice } from './sign-up-form.slice';
import type { SignupFormState } from './sign-up-form.slice';
import { selectSignupFormActions, selectSignupFormData } from './sign-up-form.selectors';
import type { SignupFormService } from './sign-up-form.service';
import type { RecursivePartial } from '@crux/utils';
import type { Action, Dispatch, MiddlewareAPI } from '@crux/redux-types';

export async function createSignupFormModule(
  { dispatch }: CruxContext,
  auth: AuthService,
  signupForm: SignupFormService,
) {
  const { actions, reducer } = signupFormSlice('signupForm');

  return {
    actions,
    create,
    destroy,
    reducer,
    views: {
      signupForm: {
        selectActions: () => selectSignupFormActions(auth, signupForm),
        selectData: selectSignupFormData,
        factory: () => import('./sign-up-form.view').then(mod => mod.createSignupFormView),
        root: 'sign-up-form',
      },
    }
  };

  function create() {
    signupForm.on('update', update);
    signupForm.on('reset', reset);
  }

  function destroy() {
    signupForm.off('update', update);
    signupForm.off('reset', reset);
  }

  function reset() {
    dispatch(actions.set(initialState));
  }
  function update(data: RecursivePartial<SignupFormState>) {
    dispatch(actions.set(data));
  }
}

