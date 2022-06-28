import { Service } from "./di";

export function byDependency(
  a: [string, Service<unknown>],
  b: [string, Service<unknown>],
) {
  const [aKey, aService] = a;
  const [bKey, bService] = b;

  if ((aService.deps || [] as string[]).includes(bKey)) {
    return 1;
  }

  if ((bService.deps || [] as string[]).includes(aKey)) {
    return -1;
  }

  return 0;
}
