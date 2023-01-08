import { service } from '@crux/crux';

export const envService = service(() => import('./env.service').then((mod) => mod.env()));
