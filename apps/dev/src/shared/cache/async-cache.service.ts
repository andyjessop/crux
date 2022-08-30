import { del, get, set } from 'idb-keyval';
import type { AsyncCache } from './types';

export function createAsyncCacheService(): AsyncCache {
  return {
    get,
    remove: del,
    set,
  };
}
