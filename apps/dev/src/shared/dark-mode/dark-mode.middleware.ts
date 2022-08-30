import type { Action, Dispatch } from "@crux/redux-types";
import type { DarkMode } from "./types";

export function createDarkModeMiddleware(darkMode: DarkMode, toggleActionType: string) {
  return () => (next: Dispatch) => (action: Action) => {
    next(action);

    if (action.type === toggleActionType) {
      darkMode.set(!darkMode.isDark());
    }
  };
}