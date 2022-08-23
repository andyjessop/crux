import { union } from './union';

describe('union', () => {
  test('finds the union of two sets', () => {
    const set1 = new Set([1, 2, 3]);
    const set2 = new Set([2, 3, 4]);

    expect(union(set1, set2)).toEqual(new Set([1, 2, 3, 4]));
  });

  test('finds the union of two sets of strings', () => {
    const set1 = new Set(['1', '2', '3']);
    const set2 = new Set(['2', '3', '4']);

    expect(union(set1, set2)).toEqual(new Set(['1', '2', '3', '4']));
  });
});
