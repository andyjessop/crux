import type { AuthState } from "../features/auth/auth.slice";
import type { LayoutState } from "./types";

export interface LayoutData {
  auth?: AuthState,
  layout: LayoutState,
}

export const selectLayoutData = ({ auth, layout }: {
  auth?: AuthState,
  layout: LayoutState,
}) => ({
  auth, layout
});