import type { LayoutState } from "../types";

export const selectLayout = (state: { layout: LayoutState }) => state.layout;