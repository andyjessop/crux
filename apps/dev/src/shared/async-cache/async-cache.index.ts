import { service } from '@crux/xapp';

export const asyncCacheService = service(() =>
  import('./async-cache.service').then((mod) => mod.asyncCache())
);
