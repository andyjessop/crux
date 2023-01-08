import { service } from '@crux/crux';

export const reportingService = service(() =>
  import('./reporting.service').then((mod) => mod.reporting())
);
