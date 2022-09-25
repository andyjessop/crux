import { machine } from "@crux/machine";
import { createSlice } from "@crux/redux-slice";
import type { ApiOf } from "@crux/redux-slice";
import { merge } from "@crux/utils";
import type { AuthAPI, AuthError } from "./api/api";
import type { User } from "./api/types";

const machineConfig = {
  initialising: {
    tokenInvalid: () => 'refreshingToken',
    tokenValid: () => 'loggedIn',
  },
  loggedIn: {
    fetchUserFailure: () => 'loggedOut',
    logout: () => 'loggedOut',
  },
  loggingIn: {
    loginSuccess: () => 'loggedIn',
    loginFailure: () => 'loggedOut',
  },
  loggedOut: {
    clickLogin: () => 'loginForm',
    clickSignup: () => 'signupForm',
    fetchUserSuccess: () => 'loggedIn',
  },
  loginForm: {
    cancelLogin: () => 'loggedOut',
    submitLoginForm: () => 'loggingIn',
  },
  refreshingToken: {
    refreshTokenSuccess: () => 'loggedIn',
    refreshTokenFailure: () => 'loggedOut',
  },
  signingUp: {
    signupFailure: () => 'loggedOut',
    signupSuccess: () => 'loggedOut',
  },
  signupForm: {
    cancelSignup: () => 'loggedOut',
    submitSignupForm: () => 'signingUp',
  },
};

export type States = keyof typeof machineConfig;

export interface AuthState {
  machineState: States | null;
  user: User | null;
}

const initialState: AuthState = {
  machineState: 'initialising',
  user: null,
}

type AuthSlice = {
  cancelLogin: void;
  cancelSignup: void;
  clickLogin: void;
  clickSignup: void;
  fetchUser: void;
  init: void;
  setMachineState: States;
  submitLoginForm: { email: string, password: string };
  submitSignupForm: { email: string, password: string };
}

export type AuthService = ApiOf<AuthSlice>;

export function createAuthSlice(name: string, authAPI: AuthAPI) {
  const authMachine = machine(machineConfig, { initialState: 'initialising' });

  const slice = createSlice<AuthSlice>()(name, initialState, {
    cancelLogin: () => async ({ api }) => {
      authMachine.cancelLogin();
    },
    cancelSignup: () =>  async ({ api }) => {
      authMachine.cancelSignup();
    },
    clickLogin: () =>  async ({ api }) => {
      authMachine.clickLogin();
    },
    clickSignup: () =>  async ({ api }) => {
      authMachine.clickSignup();
    },
    fetchUser: () => async () => {
      try {
        const user = await authAPI.user();
  
        if (isAuthError(user)) {
          authMachine.fetchUserFailure();
        } else  {
          authMachine.fetchUserSuccess();
  
          // New user
        }   
      } catch (e) {
        authMachine.fetchUserFailure();
      }
    },
    init: () => async ({ api }) => {
      try {
        const localUser = await authAPI.checkLocalUser();
  
        if (!localUser) {
          authMachine.tokenInvalid();
    
          try {
            const response = await authAPI.refreshToken();
  
            if (isAuthError(response)) {
              authMachine.refreshTokenFailure();
            } else {
              authMachine.refreshTokenSuccess();
    
              const { user, ...token } = response;

              // New Token
            }
          } catch (e) {
            authMachine.refreshTokenFailure();
    
            return;
          }
        } else {
          authMachine.tokenValid();
        }
  
        api.fetchUser();
      } catch(e) {
        throw e;
      }
    },
    setMachineState: (state, machineState) => merge(state, {
      machineState
    }),
    submitLoginForm: (state, { email, password }) => async () => {
      try {
        const nextState = await authMachine.submitLoginForm();
  
        if (nextState === 'loggingIn') {
          await authAPI.login(email, password);
        }
  
        authMachine.loginSuccess();
      } catch (e) {
        authMachine.loginFailure();
      }
    },
    submitSignupForm: (state, { email, password }) => async () => {
      try {
        const nextState = await authMachine.submitSignupForm();
  
        if (nextState === 'signingUp') {
          await authAPI.signUp(email, password);
        }
  
        authMachine.signupSuccess();
      } catch (e) {
        authMachine.signupFailure();
      }
    },
  });

  authMachine.onEnter(data => {
    slice.api.setMachineState(data.current);
  });

  return slice;
}

function isAuthError(obj: unknown): obj is AuthError {
  const anyObj = (obj as any);

  return (typeof anyObj.code === 'number' && typeof anyObj.msg === 'string') || typeof anyObj.error === 'string' || anyObj === false; 
}