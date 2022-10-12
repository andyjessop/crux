import { service } from "./service";

describe('service', () => {
  test('resolves single service', async () => {
    const a = service(() => Promise.resolve(serviceA()));

    expect(a.instance).toBeUndefined();
    expect(a.promise).toBeUndefined();

    const promiseA = a.getInstance();

    expect(promiseA.then).not.toBeUndefined();

    const result = await promiseA;

    expect(result.isA).toEqual(true);
  });

  test('resolves service with dep', async () => {
    const a = service(() => Promise.resolve(serviceA()));
    const b = service((a) => Promise.resolve(serviceB(a)), { deps: [a] });

    const promiseA = b.getInstance();

    const result = await promiseA;

    expect(result.a.isA).toEqual(true);
    expect(result.isB).toEqual(true);
  });

  test('resolves service with dep when dep already resolved', async () => {
    const a = service(() => Promise.resolve(serviceA()));
    const b = service((a) => Promise.resolve(serviceB(a)), { deps: [a] });

    const promiseA = await a.getInstance();
    const promiseB = b.getInstance();

    const result = await promiseB;

    expect(result.a.isA).toEqual(true);
    expect(result.isB).toEqual(true);
  });

  test('resolves service with dep when dep currently being resolved', async () => {
    const a = service(() => Promise.resolve(serviceA()));
    const b = service((a) => Promise.resolve(serviceB(a)), { deps: [a] });

    const promiseA = a.getInstance();
    const promiseB = b.getInstance();

    const result = await promiseB;

    expect(result.a.isA).toEqual(true);
    expect(result.isB).toEqual(true);
  });

  test('resolves service with multiple deps', async () => {
    const a = service(() => Promise.resolve(serviceA()));
    const b = service((a) => Promise.resolve(serviceB(a)), { deps: [a] });
    const c = service((a, b) => Promise.resolve(serviceC(a, b)), { deps: [a, b] });

    const promiseA = a.getInstance();
    const promiseB = b.getInstance();
    const promiseC = c.getInstance();

    const result = await promiseC;

    expect(result.a.isA).toEqual(true);
    expect(result.b.a.isA).toEqual(true);
    expect(result.b.isB).toEqual(true);
    expect(result.isC).toEqual(true);
  });

  test('resolves service with multiple deps in reverse order', async () => {
    const a = service(() => Promise.resolve(serviceA()));
    const b = service((a) => Promise.resolve(serviceB(a)), { deps: [a] });
    const c = service((a, b) => Promise.resolve(serviceC(a, b)), { deps: [a, b] });

    const promiseC = c.getInstance();
    const promiseB = b.getInstance();
    const promiseA = a.getInstance();

    const result = await promiseC;

    expect(result.a.isA).toEqual(true);
    expect(result.b.a.isA).toEqual(true);
    expect(result.b.isB).toEqual(true);
    expect(result.isC).toEqual(true);
  });

  test('resolves service with multiple deps standalone', async () => {
    const a = service(() => Promise.resolve(serviceA()));
    const b = service((a) => Promise.resolve(serviceB(a)), { deps: [a] });
    const c = service((a, b) => Promise.resolve(serviceC(a, b)), { deps: [a, b] });

    const promiseC = c.getInstance();

    const result = await promiseC;

    expect(result.a.isA).toEqual(true);
    expect(result.b.a.isA).toEqual(true);
    expect(result.b.isB).toEqual(true);
    expect(result.isC).toEqual(true);
  });
});

function serviceA() {
  return {
    isA: true
  };
}

function serviceB(a: ReturnType<typeof serviceA>) {
  return {
    a,
    isB: true
  };
}

function serviceC(a: ReturnType<typeof serviceA>, b: ReturnType<typeof serviceB>) {
  return {
    a,
    b,
    isC: true
  };
}