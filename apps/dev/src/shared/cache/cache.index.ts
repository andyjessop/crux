import { service } from '@crux/crux';

export const cacheService = service(() => import('./cache.service').then((mod) => mod.cache()));
