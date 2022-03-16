import { intersection } from './intersection';

describe('intersection', () => {
  test('finds the intersection of two sets', () => {
    const set1 = new Set([1, 2, 3]);
    const set2 = new Set([2, 3, 4]);

    expect(intersection(set1, set2)).toEqual(new Set([2, 3]));
  });

  test('finds the intersection of two sets of strings', () => {
    const set1 = new Set(['1', '2', '3']);
    const set2 = new Set(['2', '3', '4']);

    expect(intersection(set1, set2)).toEqual(new Set(['2', '3']));
  });

  test('finds the intersection when an entry is in multiple but not all sets', () => {
    const set1 = new Set(['1', '2', '3']);
    const set2 = new Set(['2', '3', '4']);
    const set3 = new Set(['3', '4', '5']);

    expect(intersection(set1, set2, set3)).toEqual(new Set(['3']));
  });
});
