import { intersection } from './intersection';
import { union } from './union';

export function symmetricDifference<T>(first: Set<T>, second: Set<T>): Set<T> {
  const u = union(first, second);
  const i = intersection(first, second);

  const differenceSet = new Set<T>();

  for (const item of u) {
    if (!i.has(item)) {
      differenceSet.add(item);
    }
  }

  return differenceSet;
}
