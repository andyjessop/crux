import { service } from '@crux/crux';

export const asyncCacheService = service(() =>
  import('./async-cache.service').then((mod) => mod.asyncCache())
);
