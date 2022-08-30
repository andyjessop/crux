import { findLastIndex } from "@crux/utils";
import { Service } from "./di";

/**
 * > 0	sort a after b
 * < 0	sort a before b
 * === 0	keep original order of a and b
*/
export function byDependency(
  a: [string, Service<unknown>],
  b: [string, Service<unknown>],
) {  
  const [aKey, aService] = a; // [key of serviceA, serviceA]
  const [bKey, bService] = b; // [key of serviceB, serviceB]

  if ((aService.deps || [] as string[]).includes(bKey)) {
    return 1;
  }

  if ((bService.deps || [] as string[]).includes(aKey)) {
    return -1;
  }

  return 0;
}

export function sortByDependency(
  services: [string, Service<unknown>][]
): [string, Service<unknown>][] {
  const sorted = [] as [string, Service<unknown>][];
  const asDepsArray = services.map(([key, service]) => service.deps || [] as string[]);

  for (const whichService of services) {
    const lastNdxOfDep = findLastIndex(asDepsArray, (deps) => containsAtLeastOneOf(deps, whichService[1].deps || []));

    if (lastNdxOfDep !== -1) {
      sorted.splice(lastNdxOfDep, 0, whichService);
    } else {
      sorted.unshift(whichService);
    }
  }

  return sorted;
}


export function containsAtLeastOneOf(arr1: string[], arr2: string[]) {
  return arr2.some(r => arr1.includes(r));
}