import { service } from '@crux/xapp';

export const featureFlagsService = service(() =>
  import('./feature-flags.service').then((mod) => mod.featureFlags())
);
