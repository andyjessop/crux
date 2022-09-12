import type { SignupFormAPI, SignupFormState } from "./sign-up-form.slice";

export function selectSignupFormActions(signupForm: SignupFormAPI) {
  return signupForm;
}

export type SignupFormData = SignupFormState;

export function selectSignupFormData(state: { signupForm: SignupFormState }): SignupFormData {
  return state.signupForm;
}