import type { CruxContext } from "@crux/app";
import { slice } from "@crux/redux-slice";
import type { Action, Dispatch, MiddlewareAPI } from "@crux/redux-types";
import { merge } from "@crux/utils";
import { createDarkModeMiddleware } from "./dark-mode.middleware";
import type { DarkMode as DarkModeService } from "./types";

export type Actions = ReturnType<typeof createSlice>['actions'];

export interface State {
  isDark: boolean
}

export function createDarkModeModule(ctx: CruxContext, darkMode: DarkModeService) {
  const { actions, reducer } = createSlice(darkMode.isDark());
  const middleware = createDarkModeMiddleware(darkMode, actions.toggle.type);

  return {
    actions,
    middlewares: [middleware],
    reducer,
    subscriptions: [
      (state: any) => state.darkMode.isDark,
      (isDark: boolean) => darkMode.set(isDark)
    ]
  };
}

export function createSlice(isDark: boolean) {
  return slice({
    set: (state, payload: boolean) => merge(state, {
      isDark: payload
    }),
    toggle: (state) => merge(state, {
      isDark: !state.isDark
    }),
  }, {
    name: 'dark-mode',
    initialState: { isDark },
  });
}