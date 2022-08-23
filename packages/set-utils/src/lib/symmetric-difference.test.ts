import { symmetricDifference } from './symmetric-difference';

describe('symmetricDifference', () => {
  test('finds the symmetric difference of two sets', () => {
    const set1 = new Set([1, 2, 3]);
    const set2 = new Set([2, 3, 4]);

    expect(symmetricDifference(set1, set2)).toEqual(new Set([1, 4]));
  });

  test('finds the symmetric difference of two string sets', () => {
    const set1 = new Set(['1', '2', '3']);
    const set2 = new Set(['2', '3', '4']);

    expect(symmetricDifference(set1, set2)).toEqual(new Set(['1', '4']));
  });
});
