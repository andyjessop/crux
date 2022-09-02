import { simpleSlice } from "@crux/redux-slice";

export interface SignupFormState {
  email: {
    errorMessages: string[];
    isPristine: boolean;
    name: string;
    placeholder: string;
    successMessage: string | null;
    // value is taken from AuthState
  },
  password: {
    errorMessages: string[];
    isPristine: boolean;
    name: string;
    placeholder: string;
    successMessage: string | null;
    value: string | null;
  },
  emailValue: string | null;
}

const initialState: SignupFormState = {
  email: {
    errorMessages: [],
    isPristine: true,
    name: 'email',
    placeholder: 'Your email address',
    successMessage: null,
  },
  password: {
    errorMessages: [],
    isPristine: true,
    name: 'password',
    placeholder: 'Your email address',
    successMessage: null,
    value: null,
  },
  emailValue: null,
};

export function signupFormSlice(name: string) {
  return simpleSlice(initialState, name);
}