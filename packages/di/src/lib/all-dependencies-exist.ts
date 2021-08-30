import { Collection } from "./di";

export function allDependenciesExist<T>(
  services: Collection<T>,
  dependencies: (keyof T | { constructor: keyof T, singleton: boolean })[],
) {
  const servicesKeys = <(keyof T)[]>Object.keys(services);
  
  return dependencies.every((dependency) => {
    if (typeof dependency === 'object') {
      return servicesKeys.includes(<keyof T>dependency.constructor)
    } 
    
    return servicesKeys.includes(<keyof T>dependency);
  });
}
