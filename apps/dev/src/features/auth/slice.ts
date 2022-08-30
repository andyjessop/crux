import { slice } from "@crux/redux-slice";
import type { States } from "./domain/auth";

interface User {
  id: string;
  role: string;
  email: string;
}

export interface AuthState {
  machineState: States | null;
  user: User | null;
}

const initialState: AuthState = {
  machineState: null,
  user: null,
}

export function authSlice() {
  return slice({
    setUser: (state: AuthState, payload: User | null) => ({
      ...state,
      user: payload
    }),
    setMachineState: (state: AuthState, payload: States) => ({
      ...state,
      machineState: payload
    }),
  }, { initialState, name: 'auth' } );
}