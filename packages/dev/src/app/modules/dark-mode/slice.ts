import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DarkMode {
  isDark: boolean;
}

const initialState: DarkMode = { isDark: false };

const darkModeSlice = createSlice({
  name: 'dark-mode',
  initialState,
  reducers: {
    set(state, action: PayloadAction<boolean>) {
      state.isDark = action.payload;
    },
  },
});

export const { actions, reducer } = darkModeSlice;