import { createSelector } from 'reselect';
import type { RouterState } from './router.slice';

const selectRouter = (state: { router: RouterState }) => state.router;

export const selectRoute = createSelector(
  selectRouter,
  router => router?.route ?? null
);