import type { Action, Dispatch, MiddlewareAPI } from "@crux/redux-types";
import type { Auth } from "./domain/auth";
import type { authSlice } from "./slice";

export function createAuthMiddleware(auth: Auth, actions: ReturnType<typeof authSlice>['actions']) {
  return (api: MiddlewareAPI) => {

    return (next: Dispatch) => (action: Action) => {
      next(action);
    }
  }
}