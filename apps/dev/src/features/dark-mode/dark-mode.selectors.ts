import type { DarkModeState } from "./dark-mode.slice";

export function selectDarkModeData(state: { darkMode: DarkModeState }) {
  return state.darkMode;
};