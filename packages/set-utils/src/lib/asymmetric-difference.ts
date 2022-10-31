import { intersection } from './intersection';

/**
 * Return those entries that are in first, but not in second.
 */
export function asymmetricDifference<T>(first: Set<T>, second: Set<T>): Set<T> {
  const i = intersection(first, second);

  const differenceSet = new Set<T>();

  for (const item of first) {
    if (!i.has(item)) {
      differenceSet.add(item);
    }
  }

  return differenceSet;
}
