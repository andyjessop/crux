import { configureStore } from '@reduxjs/toolkit';
import { middleware, reducer, reducerId } from './data/api';

export const store = configureStore({
  reducer: {
    [reducerId]: reducer,
  },
  middleware: [middleware],
});

(window as any).store = store;