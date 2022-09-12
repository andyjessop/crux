import type { createToasterSlice, ToasterState } from "./toaster.slice";

export type ToasterActions = ReturnType<typeof createToasterSlice>['actions'];

export function selectActions(actions: { toast: ToasterActions }) {
  return actions.toast;
}

export function selectData(state: { toast: ToasterState }) {
  return state.toast;
}