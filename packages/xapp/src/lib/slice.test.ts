import { createStore, DynamicStore } from "@crux/create-store";
import { Action, Dispatch } from "@crux/redux-types";
import { service } from "./service";
import { slice } from "./slice";

let store: DynamicStore;

describe('slice', () => {
  beforeEach(() => {
    store = createStore();
  })

  test('should create a slice', async () => {
    const a = slice(() => Promise.resolve(sliceA()), { name: 'a' });

    a.bindStore(store);

    const instanceA = await a.getInstance();

    expect(instanceA.api.isA).toEqual(true);

    // If this passes, then the reducer is registered
    expect(store.getState()).toEqual({ a: { initialA: true } });
  });

  test('should create a slice (2)', async () => {
    const a = slice(() => Promise.resolve(sliceA()), { name: 'a' });
    const b = slice((a) => Promise.resolve(sliceB(a)), { deps: [a], name: 'b' });

    a.bindStore(store);
    b.bindStore(store);

    const instanceB = await b.getInstance();

    expect(instanceB.api.isB).toEqual(true);
    expect(store.getState()).toEqual({
      a: { initialA: true },
      b: { initialB: true },
    });
  });

  test('should create two slices', async () => {
    const a = slice(() => Promise.resolve(sliceA()), { name: 'a' });
    const b = slice((a) => Promise.resolve(sliceB(a)), { deps: [a], name: 'b' });

    a.bindStore(store);
    b.bindStore(store);

    const instanceA = await a.getInstance();
    const instanceB = await b.getInstance();

    expect(store.getState()).toEqual({
      a: { initialA: true },
      b: { initialB: true },
    });
  });

  test('should create two slices when instantiated in reverse', async () => {
    const a = slice(() => Promise.resolve(sliceA()), { name: 'a' });
    const b = slice((a) => Promise.resolve(sliceB(a)), { deps: [a], name: 'b' });

    a.bindStore(store);
    b.bindStore(store);

    const instanceB = await b.getInstance();
    const instanceA = await a.getInstance();
    
    expect(store.getState()).toEqual({
      a: { initialA: true },
      b: { initialB: true },
    });
  });

  test('should create two slices (2)', async () => {
    const a = slice(() => Promise.resolve(sliceA()), { name: 'a' });
    const b = slice((a) => Promise.resolve(sliceB(a)), { deps: [a], name: 'b' });

    a.bindStore(store);
    b.bindStore(store);

    const instanceB = b.getInstance();
    const instanceA = a.getInstance();
    
    await instanceB;

    expect(store.getState()).toEqual({
      a: { initialA: true },
      b: { initialB: true },
    });
  });

  test('should create two slices (3)', async () => {
    const a = slice(() => Promise.resolve(sliceA()), { name: 'a' });
    const b = slice((a) => Promise.resolve(sliceB(a)), { deps: [a], name: 'b' });

    a.bindStore(store);
    b.bindStore(store);

    const instanceB = await b.getInstance();
    const instanceA = a.getInstance();
    
    expect(store.getState()).toEqual({
      a: { initialA: true },
      b: { initialB: true },
    });
  });

  test('should have a slice as a dependency of a service', async () => {
    const a = slice(() => Promise.resolve(sliceA()), { name: 'a' });
    const b = slice((a) => Promise.resolve(sliceB(a)), { deps: [a], name: 'b' });
    const c = service((a, b) => Promise.resolve(serviceC(a, b)), { deps: [a, b] });

    a.bindStore(store);
    b.bindStore(store);

    const instanceC = await c.getInstance();
    
    expect(store.getState()).toEqual({
      a: { initialA: true },
      b: { initialB: true },
    });
    expect(instanceC.isC).toEqual(true);
    expect(instanceC.a.isA).toEqual(true);
    expect(instanceC.b.isB).toEqual(true);
  });
});

function sliceA() {
  return {
    api: {
      isA: true,
    },
    middleware: () => (next: Dispatch) => (action: Action) => next(action),
    reducer: (state: any, action: Action) => ({ initialA: true }),
  };
}

function sliceB(apiA: ReturnType<typeof sliceA>['api']) {
  return {
    api: {
      apiA,
      isB: true,
    },
    middleware: () => (next: Dispatch) => (action: Action) => next(action),
    reducer: (state: any, action: Action) => ({ initialB: true }),
  };
}

function serviceC(a: ReturnType<typeof sliceA>['api'], b: ReturnType<typeof sliceB>['api']) {
  return {
    a,
    b,
    isC: true
  };
}