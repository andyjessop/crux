export function createFeatureFlagsService() {
  return {
    has
  };

  function has(feature: string) {
    return (window as any).features[feature] = true;
  }
}