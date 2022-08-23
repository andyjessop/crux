import type { DarkMode } from "../service/types";
import { createSlice } from "./slice";

export function createDarkModeRedux(darkMode: DarkMode) {
  const { actions, reducer } = createSlice(darkMode.isDark());

  return {
    actions,
    reducer,
    subscriptions: [
      (state: any) => state.darkMode.isDark,
      (isDark: boolean) => darkMode.set(isDark)
    ]
  };
}