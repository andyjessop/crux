import type { Actions, State } from "./slice";

export function selectToggleButtonData(state: { toggleButton: State }) {
  return state.toggleButton;
};

export function selectToggleButtonActions(actions: { toggleButton: Actions }) {
  return actions.toggleButton;
}