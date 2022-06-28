import { Model } from './di';

export function allDependenciesExist<T>(
  services: Map<string, Model<any>>,
  dependencies: (keyof T & string)[]
) {
  const keys = [...services.keys()];

  return dependencies.every((dependency) => keys.includes(dependency));
}
