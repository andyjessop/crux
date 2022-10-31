import { createExternallyResolvablePromise } from './create-externally-resolvable-promise';

describe('Utils/Promise: createExternallyResolvablePromise', () => {
  it('should resolve with external method', () => {
    const result = 'foobar';
    const { promise, resolve } = createExternallyResolvablePromise();

    resolve(result);

    return promise.then((res) => {
      expect(res).toEqual(result);
    });
  });

  it('should reject with external method', () => {
    const result = 'bazbar';
    const { promise, reject } = createExternallyResolvablePromise();

    reject(result);

    return promise.catch((res) => {
      expect(res).toEqual(result);
    });
  });
});
