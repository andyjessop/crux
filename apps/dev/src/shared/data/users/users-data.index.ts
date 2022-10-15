import { service } from '@crux/xapp';
import { dataService } from '../data.index';
import { usersHttpApi } from '../../http/users/users-http.index';

export const usersDataService = service(
  (data, users) => import('./users-data.service').then(mod => mod.usersData(data.createResource, users)),
  {
    deps: [dataService, usersHttpApi],
  }
)