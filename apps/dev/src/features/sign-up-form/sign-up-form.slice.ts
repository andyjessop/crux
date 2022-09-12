import { ApiOf, createSlice } from "@crux/redux-slice";
import { debounce, merge, validate } from "@crux/utils";
import type { AuthService } from "../auth/auth.slice";
import { validators } from "./sign-up.form.validators";

export interface SignupFormState {
  email: {
    errors: string[];
    isPristine: boolean;
    name: 'email';
    placeholder: string;
    messages: string | null;
    value: string;
  },
  formState: 'idle' | 'submitting',
  password: {
    errors: string[];
    isPristine: boolean;
    name: 'password';
    placeholder: string;
    messages: string | null;
    value: string | null;
  },
}

export const initialState: SignupFormState = {
  email: {
    errors: [],
    isPristine: true,
    name: 'email',
    placeholder: 'Your email address',
    messages: null,
    value: null,
  },
  formState: 'idle',
  password: {
    errors: [],
    isPristine: true,
    name: 'password',
    placeholder: 'Your email address',
    messages: null,
    value: null,
  },
};

type SignupFormSlice = {
  onChange: { field: 'email' | 'password', value: string },
  onSubmit: { email: string, password: string },
  reset: void,
  setFormState: 'idle' | 'submitting',
  setValue: { field: 'email' | 'password', value: string },
  setMessages: { field: 'email' | 'password', errors: string[], messages: string[] },
};

export type SignupFormAPI = ApiOf<SignupFormSlice>;

export function createSignupFormSlice(auth: AuthService, name: string) {
  return createSlice<SignupFormSlice>()(name, initialState, {
    onChange: (state, { field, value }) => async ({ api }) => onChange(api, { field, value }),
    onSubmit: (state, { email, password }) => async ({ api }) => onSubmit(api, auth, { email, password }),
    reset: () => initialState,
    setFormState: (state, formState) => merge(state, { formState }),
    setValue: (state, { field, value }) => merge(state, {
      [field]: {
        isPristine: false,
        value,
      }
    }),
    setMessages: (state, { errors, field, messages }) => merge(state, {
      [field]: {
        errors,
        messages,
      }
    })
  });
}

function onChange(
  api: SignupFormAPI,
  { field, value }: { field: 'email' | 'password', value: string },
) {
  api.setValue({ field, value });

  debounce(async () => {
    const { errors, messages } = await validate(value, validators[field]);

    api.setMessages({ field, errors, messages });
  }, 250)();
}

async function onSubmit(
  api: SignupFormAPI,
  auth: AuthService,
  { email, password }: { email: string, password: string },
) {
  await api.reset(); // reset the store

  auth.submitSignupForm({ email, password });
}