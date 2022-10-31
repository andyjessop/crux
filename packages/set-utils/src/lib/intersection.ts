/**
 * Get the intersection between multiple sets.
 */
export function intersection<T>(...iterables: Set<T>[]): Set<T> {
  if (iterables.length === 1) {
    return iterables[0];
  }

  const intersectionSet = new Set<T>();

  for (const iterable of iterables) {
    for (const item of iterable) {
      if (iterables.every((one) => one.has(item))) {
        intersectionSet.add(item);
      }
    }
  }

  return intersectionSet;
}
