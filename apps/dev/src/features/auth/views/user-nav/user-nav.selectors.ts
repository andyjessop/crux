import type { AuthService, AuthState } from "../../auth.slice";
import type { User } from "../../api/types";

export type UserNavActions = Pick<AuthService, 'clickLogin' | 'clickSignup'>;

export function selectUserNavActions(auth: AuthService): UserNavActions {
  return {
    clickLogin: auth.clickLogin,
    clickSignup: auth.clickSignup
  };
}

export interface UserNavData {
  user: User | null;
}


export function selectUserNavData(state: { auth: AuthState }): UserNavData {
  return { user: state.auth.user };
}