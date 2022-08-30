import type { Actions, State } from "../../shared/dark-mode/dark-mode.module";

export function selectToggleButtonData(state: { darkMode: State }) {
  return state.darkMode;
};

export function selectToggleButtonActions(actions: { darkMode: Actions }) {
  return actions.darkMode;
}