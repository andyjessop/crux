import { createSlice } from '@crux/redux-slice'
import { merge } from '@crux/utils';
import type { LayoutState } from './types';

const initialState: LayoutState = {
  roots: {
    sidebar: true,
    top: true,
  }
};

type LayoutSlice = {
  toggleSidebar: void
};

export function createLayoutModule() {
  return createSlice<LayoutSlice>()('layout', initialState, {
    toggleSidebar: (state: LayoutState) => merge(state, {
      roots: {
        sidebar: !state.roots.sidebar
      },
    }),
  });
}