import type { ToasterState } from "./toaster.slice";

export function selectData(state: { toast: ToasterState }) {
  return state.toast;
}