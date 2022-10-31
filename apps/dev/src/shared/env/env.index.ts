import { service } from '@crux/xapp';

export const envService = service(() => import('./env.service').then((mod) => mod.env()));
