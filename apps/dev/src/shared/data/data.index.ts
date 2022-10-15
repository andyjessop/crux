import { service, slice } from '@crux/xapp';
import type { API as queryAPI } from "@crux/query";
import { query } from "@crux/query";

export const dataService = service(() => query('data'));

export const dataSlice = slice(
  (query) => import('./data.slice').then(mod => mod.dataSlice(query)),
  {
    deps: [dataService],
    name: 'data',
  }
);