import { slice } from '@crux/redux-slice'

interface DarkMode {
  isDark: boolean;
}

const initialState: DarkMode = { isDark: false };

export function createSlice(isDark: boolean) {
  return slice({
    set: (state, payload: boolean) => ({
      ...state,
      isDark: payload
    }),
  }, {
    name: 'dark-mode',
    initialState,
  });
}
