import { createSlice } from '@crux/slice';

export interface LayoutState {
  darkModeToggle: boolean;
  toaster: boolean;
}

const initialState: LayoutState = {
  darkModeToggle: true,
  toaster: true,
};

export type LayoutStateAPI = ReturnType<typeof createLayoutSlice>['api'];

export function createLayoutSlice(name: string) {
  return createSlice(name, initialState, {});
}
