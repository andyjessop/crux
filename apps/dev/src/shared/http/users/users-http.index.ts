import { service } from '@crux/crux';

export const usersHttpApi = service(() =>
  import('./users-http.service').then((mod) => mod.createUsersHttp())
);
