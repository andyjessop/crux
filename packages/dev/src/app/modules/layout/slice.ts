import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Layout = Record<string, boolean>;

const initialState = {} as Layout;

export const { actions, reducer } = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    setRegion(state, action: PayloadAction<{ [key: string]: boolean}>) {
      for (const [key, value] of Object.entries(action.payload)) {
        state[key] = value;
      }
    },
  },
});