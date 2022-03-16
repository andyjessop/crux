import { State } from '@crux/redux-router';

export const selectRoute = (state: { router: State }) => state.router.route;