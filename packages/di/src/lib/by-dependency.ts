import { findLastIndex } from '@crux/utils';
import { Service } from './di';

export function sortByDependency(
  services: [string, Service<unknown>][]
): [string, Service<unknown>][] {
  const sorted = [] as [string, Service<unknown>][];
  const asDepsArray = services.map(([key, service]) => service.deps || ([] as string[]));

  for (const whichService of services) {
    const lastNdxOfDep = findLastIndex(asDepsArray, (deps) =>
      containsAtLeastOneOf(deps, whichService[1].deps || [])
    );

    if (lastNdxOfDep !== -1) {
      sorted.splice(lastNdxOfDep, 0, whichService);
    } else {
      sorted.unshift(whichService);
    }
  }

  return sorted;
}

export function containsAtLeastOneOf(arr1: string[], arr2: string[]) {
  return arr2.some((r) => arr1.includes(r));
}
