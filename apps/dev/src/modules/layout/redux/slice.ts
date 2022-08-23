import { slice } from '@crux/redux-slice'
import type { LayoutState } from '../types';

const initialState: LayoutState = {
  roots: {
    controls: true,
    preview: true,
    production: true,
    releases: true,
    sidebar: true,
    staging: true,
    top: true,
  }
};

export function createLayoutSlice() {
  return slice({
    toggleSidebar: (state: LayoutState) => ({
      ...state,
      roots: {
        ...state.roots,
        sidebar: !state.roots.sidebar
      },
    }),
  }, { initialState });
}