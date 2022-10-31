import { service } from '@crux/xapp';

export const cacheService = service(() => import('./cache.service').then((mod) => mod.cache()));
