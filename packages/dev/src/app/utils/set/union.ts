/**
 * Get the union of multiple sets.
 */
export function union<T>(...iterables: Set<T>[]): Set<T> {
  const set = new Set<T>();

  for (const iterable of iterables) {
    for (const item of iterable) {
      set.add(item);
    }
  }

  return set;
}
