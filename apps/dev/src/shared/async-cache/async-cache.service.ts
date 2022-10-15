import { del, get, set } from 'idb-keyval';
import type { AsyncCache } from '../cache/types';

export function asyncCache(): AsyncCache {
  return {
    get,
    remove: del,
    set,
  };
}
