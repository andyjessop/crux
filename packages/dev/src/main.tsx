import { configureStore } from '@reduxjs/toolkit';
import { middleware, reducer as routerReducer } from './app/modules/router';
import { createCore } from '@crux/core';
import { createLayout } from './app/layout';
import { withPauseResume } from './app/store';

const root = document.getElementById('root');

const store = configureStore({
  reducer: {
    router: routerReducer,
  },
  middleware: [middleware]
});

const layout = createLayout();

const core = createCore(withPauseResume(store), layout, root);
