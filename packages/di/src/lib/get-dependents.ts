import { Model } from './di';

export function getDependents(name: string, services: Map<string, Model<any>>) {
  const entries = services.entries();
  const dependents: string[] = [];

  for (const [_, model] of entries) {
    if (model.deps.includes(name)) {
      dependents.push(name);
    }
  }

  return dependents;
}
