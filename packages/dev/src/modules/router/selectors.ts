import { createSelector } from '@reduxjs/toolkit';
import { State } from '@crux/redux-router';

const selectRouter = (state: { router: State }) => state.router;

export const selectRoute = createSelector(
  selectRouter,
  (router) => router.route
);