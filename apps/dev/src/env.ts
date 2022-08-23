export function getEnvVariable(key: string): string {
  return (window as any).runestone.variables[key];
}

export function getEnv(): string {
  return (window as any).runestoneEnv;
}

export function getVariables() {
  return (window as any).runestone.variables;
}

export function getFeatures() {
  return (window as any).runestone.features;
}

export function hasFeature(key: string) {
  return getFeatures()[key] === true;
}