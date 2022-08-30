import { slice } from "@crux/redux-slice";

interface User {
  id: string;
  role: string;
  email: string;
}

export interface AuthState {
  isShowingSignupForm: boolean;
  user: User | null;
}

const initialState: AuthState = {
  isShowingSignupForm: false,
  user: null
}

export function authSlice() {
  return slice({
    setUser: (state: AuthState, payload: User | null) => ({
      ...state,
      user: payload
    }),
    showSignupForm: (state: AuthState, payload: boolean) => ({
      ...state,
      isShowingSignupForm: payload
    }),
  }, { initialState, name: 'auth' } );
}