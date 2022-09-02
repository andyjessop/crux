import type { User } from "../auth/api/types";
import type { AuthState } from "../auth/auth.slice";
import type { AuthService } from "../auth/services/auth.service";
import type { SignupFormService } from "./sign-up-form.service";
import type { SignupFormState } from "./sign-up-form.slice";

export type SignupFormActions = SignupFormService & Pick<AuthService, 'submitSignupForm'>;

export function selectSignupFormActions(auth: AuthService, signupForm: SignupFormService) {
  return {
    onChangeEmail: signupForm.onChangeEmail,
    onChangePassword: signupForm.onChangePassword,
    onSubmit: auth.submitSignupForm
  };
}

export type SignupFormData = SignupFormState;

export function selectSignupFormData(state: { auth: AuthState, signupForm: SignupFormState }): SignupFormData {
  return {
    ...state.signupForm,
    emailValue: state.auth.user?.email ?? null
  };
}