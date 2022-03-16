import { Layout } from "./slice";

export const selectLayout = (state: { layout: Layout }) => state.layout;