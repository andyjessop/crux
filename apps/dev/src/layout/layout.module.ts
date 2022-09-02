import { slice } from '@crux/redux-slice'
import { merge } from '@crux/utils';
import type { LayoutState } from './types';

const initialState: LayoutState = {
  roots: {
    sidebar: true,
    top: true,
  }
};

export function createLayoutModule() {
  return slice({
    toggleSidebar: (state: LayoutState) => merge(state, {
      roots: {
        sidebar: !state.roots.sidebar
      },
    }),
  }, { initialState });
}