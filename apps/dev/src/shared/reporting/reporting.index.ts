import { service } from '@crux/xapp';

export const reportingService = service(() =>
  import('./reporting.service').then((mod) => mod.reporting())
);
