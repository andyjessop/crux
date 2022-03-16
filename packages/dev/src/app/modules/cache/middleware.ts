import { AnyAction, Dispatch, MiddlewareAPI } from '@reduxjs/toolkit';
import { Cache } from '../../services/cache/types';

export function createCacheMiddlware(cache: Cache) {
  return (api: MiddlewareAPI) => (next: Dispatch<AnyAction>) => (action: AnyAction) => {
    if (action.type === 'cache/set') {
      const { key, value } = action.payload;

      cache.set(key, value);
    }

    next(action);
  };
}
