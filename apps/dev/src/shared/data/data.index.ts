import { service, slice } from '@crux/crux';
import { data } from './data.service';

export const dataService = service(data);

export const dataSlice = slice(
  (query) => import('./data.slice').then((mod) => mod.dataSlice(query)),
  {
    deps: [dataService],
    name: 'data',
  }
);
