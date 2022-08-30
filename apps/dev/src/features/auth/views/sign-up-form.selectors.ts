import type { LayoutState } from "../../../layout/types";

export function selectActions() {
  return {};
}

export function selectData(state: { layout: LayoutState }) {
  return state.layout.roots.signUpForm;
}