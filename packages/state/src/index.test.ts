test('should be true', () => {
  type T = 3;
  expect(<T>3).toEqual(3);
});
