import { simpleSlice, slice } from "@crux/redux-slice";
import { merge } from "@crux/utils";
import type { User } from "./api/types";
import type { States } from "./services/auth.service";

export interface AuthState {
  machineState: States | null;
  user: User | null;
}

const initialState: AuthState = {
  machineState: null,
  user: null,
}

export function authSlice(name: string) {
  return simpleSlice(initialState, name);
}