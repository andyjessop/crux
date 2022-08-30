import { createEventEmitter } from "@crux/event-emitter";
import type { EventEmitter } from '@crux/event-emitter';
import { machine } from "@crux/machine";
import type { Events as MachineEvents } from '@crux/machine';

import type { AuthAPI, AuthError } from "../api/api";
import type { Token, User } from "../api/types";

const machineConfig = {
  initialising: {
    tokenInvalid: () => 'refreshingToken',
    tokenValid: () => 'loggedIn',
  },
  loginForm: {
    cancelLogin: () => 'loggedOut',
    submitLoginForm: () => 'loggingIn',
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
  refreshingToken: {
    refreshTokenSuccess: () => 'loggedIn',
    refreshTokenFailure: () => 'loginForm',
  },
  signupForm: {
    cancelSignup: () => 'loggedOut',
    submitSignupForm: () => 'signingUp',
  },
  signingUp: {
    signupFailure: () => 'signupForm',
    signupSuccess: () => 'unconfirmed',
  }
};

export type States = keyof typeof machineConfig;

type Events = {
  newToken: Token;
  stateChange: MachineEvents<typeof machineConfig>['onEnter'];
  user: User;
};

export interface Auth extends EventEmitter<Events> {
  clickLogin(): void;
  clickSignup(): void;
  submitLoginForm(email: string, password: string): Promise<void>;
  submitSignupForm(email: string, password: string): Promise<void>;
}

export async function createAuth(api: AuthAPI): Promise<Auth> {
  const emitter = createEventEmitter<Events>();

  const auth = machine(machineConfig, { initialState: 'initialising' });

  init();

  auth.onEnter(data => {
    emitter.emit('stateChange', data);
  })

  return {
    ...emitter,
    clickLogin: () => { auth.clickLogin(); },
    clickSignup: () => { auth.clickSignup(); },
    submitLoginForm,
    submitSignupForm,
  };

  async function fetchUser() {
    try {
      const user = await api.user();

      if (isAuthError(user)) {
        auth.fetchUserFailure();
      } else  {
        auth.fetchUserSuccess();

        emitter.emit('user', user);
      }   
    } catch (e) {
      auth.fetchUserFailure();
    }
  }

  async function init() {
    try {
      const localUser = await api.checkLocalUser();

      if (!localUser) {
        auth.tokenInvalid();
  
        try {
          const response = await api.refreshToken();

          if (isAuthError(response)) {
            auth.refreshTokenFailure();
          } else {
            auth.refreshTokenSuccess();
  
            const { user, ...rest } = response;

            emitter.emit('newToken', rest);
          }
        } catch (e) {
          auth.refreshTokenFailure();
  
          return;
        }
      } else {
        auth.tokenValid();
      }

      fetchUser();
    } catch(e) {
      throw e;
    }
  }

  async function submitLoginForm(email: string, password: string) {
    try {
      const nextState = await auth.submitLoginForm();

      if (nextState === 'loggingIn') {
        await api.login(email, password);
      }

      auth.loginSuccess();
    } catch (e) {
      auth.loginFailure();
    }
  }

  async function submitSignupForm(email: string, password: string) {
    try {
      const nextState = await auth.submitSignupForm();

      if (nextState === 'signingUp') {
        await api.signUp(email, password);
      }

      auth.signupSuccess();
    } catch (e) {
      auth.signupFailure();
    }
  }
}

function isAuthError(obj: unknown): obj is AuthError {
  const anyObj = (obj as any);

  return (typeof anyObj.code === 'number' && typeof anyObj.msg === 'string') || typeof anyObj.error === 'string' || anyObj === false; 
}