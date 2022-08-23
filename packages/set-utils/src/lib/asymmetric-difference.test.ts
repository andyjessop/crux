import { asymmetricDifference } from './asymmetric-difference';

describe('asymmetricDifference', () => {
  test('finds the symmetric difference of two sets', () => {
    const set1 = new Set([1, 2, 3]);
    const set2 = new Set([2, 3, 4]);

    expect(asymmetricDifference(set1, set2)).toEqual(new Set([1]));
  });

  test('finds the symmetric difference of two string sets', () => {
    const set1 = new Set(['1', '2', '3']);
    const set2 = new Set(['2', '3', '4']);

    expect(asymmetricDifference(set1, set2)).toEqual(new Set(['1']));
  });
});
