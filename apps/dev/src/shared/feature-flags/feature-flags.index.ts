import { service } from '@crux/crux';

export const featureFlagsService = service(() =>
  import('./feature-flags.service').then((mod) => mod.featureFlags())
);
