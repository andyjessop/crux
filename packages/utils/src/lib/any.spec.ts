import { merge } from "./any";

const dest = {
  a: true,
  b: {
    c: [1, 2],
    d: { e: true },
    f: true
  },
  g: [1, 2],
  h: {
    i: true
  }
}

test('updates shallow primitive', () => {
  expect(merge(dest, {
    a: false
  })).toEqual({...dest, a: false });
});

test('updates nested primitive', () => {
  expect(merge(dest, {
    b: { f: false }
  })).toEqual({ ...dest, b: { ...dest.b, f: false } });
});

test('updates shallow array immutably', () => {
  const updated = merge(dest, {
    g: [1, 2]
  });

  expect(updated).toEqual(dest);
  expect(updated.g === dest.g).toEqual(false);
});

test('updates shallow object immutably', () => {
  const updated = merge(dest, {
    h: {
      i: true
    }
  });

  expect(updated).toEqual(dest);
  expect(updated.h === dest.h).toEqual(false);
});

test('updates nested array immutably', () => {
  const updated = merge(dest, {
    b: { c: [1, 2] }
  });

  expect(updated).toEqual(dest);
  expect(updated.b === dest.b).toEqual(false);
  expect(updated.b.c === dest.b.c).toEqual(false);
});