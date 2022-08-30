import type { Auth } from "../../domain/auth";
import type { AuthState } from "../../slice";

export function selectUserNavData(state: { auth: AuthState }) {
  return state.auth;
}

export type AuthActions = Pick<Auth, 'clickLogin' | 'clickSignup'>;

export function selectUserNavActions(auth: Auth): AuthActions {
  const {
    clickLogin, clickSignup
  } = auth;

  return {
    clickLogin, clickSignup
  };
}