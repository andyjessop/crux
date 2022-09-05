import { simpleSlice } from "@crux/redux-slice";

export interface SignupFormState {
  email: {
    errorMessages: string[];
    isPristine: boolean;
    name: string;
    placeholder: string;
    successMessage: string | null;
    value: string;
  },
  password: {
    errorMessages: string[];
    isPristine: boolean;
    name: string;
    placeholder: string;
    successMessage: string | null;
    value: string | null;
  },
}

export const initialState: SignupFormState = {
  email: {
    errorMessages: [],
    isPristine: true,
    name: 'email',
    placeholder: 'Your email address',
    successMessage: null,
    value: null,
  },
  password: {
    errorMessages: [],
    isPristine: true,
    name: 'password',
    placeholder: 'Your email address',
    successMessage: null,
    value: null,
  },
};

export function signupFormSlice(name: string) {
  return simpleSlice(initialState, name);
}