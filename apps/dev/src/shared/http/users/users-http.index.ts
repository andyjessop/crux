import { service } from '@crux/xapp';

export const usersHttpApi = service(
  () => import('./users-http.service').then(mod => mod.createUsersHttp()),
);