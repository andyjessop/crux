import { createCruxStore } from '@nx/store';
import type { CruxStore } from '@nx/store';

type State = {
  a: boolean;
  b: {
    c: boolean;
  };
  d: string;
}

let initialState: State;
let callback: jest.Mock;
let store: CruxStore<State>;

describe('@crux/state', () => {
  beforeEach(() => {
    initialState = {
      a: true,
      b: {
        c: false,
      },
      d: 'old value',
    };

    callback = jest.fn();

    store = createCruxStore(initialState);
  });

  test('should add subscriber', () => {
    const getA = (state: State) => state.a;

    const unsubscribe = store.subscribe(getA, callback);

    expect(typeof unsubscribe).toEqual('function');
  });
  
  test('should call callback immediately upon subscription', () => {
    const getA = (state: State) => state.a;

    store.subscribe(getA, callback);

    expect(callback.mock.calls.length).toEqual(1);
  });

  test('should call callback when top level property is updated', () => {
    const getA = (state: State) => state.a;

    store.subscribe(getA, callback);

    store.update({ a: false });

    expect(callback.mock.calls.length).toEqual(2);
  });

  test('should call callback when reference changes', () => {
    const getC = (state: State) => state.b.c;

    store.subscribe(getC, callback);

    store.update({ b: { c: true } });

    expect(callback.mock.calls.length).toEqual(2);
  });

  test('should not call callback when reference does not change', () => {
    const getB = (state: State) => state.b;

    store.subscribe(getB, callback);

    store.update({ b: { c: false } });

    expect(callback.mock.calls.length).toEqual(1);
  });

  test('should be able to transform output', () => {
    const getDTransformed = (state: State) => `${state.d} transformed`;

    store.subscribe(getDTransformed, callback);

    store.update({ d: 'new value' });

    expect(callback.mock.calls[0][0]).toEqual('old value transformed');
    expect(callback.mock.calls[1][0]).toEqual('new value transformed');
  });

  test('should be able to pass multiple parameters to selector', () => {
    const getMultiple = (state: State, a: string, b: boolean) => `${state.d}, a, b`;

    store.subscribe(getMultiple, callback);

    store.update({ d: 'd' });

    expect(callback.mock.calls[1][0]).toEqual('d, a, b');
  });

  test('should update nested object', () => {
    const getC = (state: State) => state.b.c;

    store.subscribe(getC, callback);

    store.update({ c: true }, 'b');

    expect(callback.mock.calls[1][0]).toEqual(true);
  });

  test('should destroy subscriber after calling returned destroy function', () => {
    const getB = (state: State) => state.b;

    const unsubscribe = store.subscribe(getB, callback);

    unsubscribe();

    store.update({ b: { c: false } });

    expect(callback.mock.calls.length).toEqual(1);
  });

  test('should pause callbacks', () => {
    const getA = (state: State) => state.a;

    const unsubscribe = store.subscribe(getA, callback);

    store.pause();

    store.update({ a: false });

    expect(callback.mock.calls.length).toEqual(1);
  });

  test('should resume callbacks', () => {
    const getA = (state: State) => state.a;

    const unsubscribe = store.subscribe(getA, callback);

    store.pause();

    store.update({ a: false });

    expect(callback.mock.calls.length).toEqual(1);

    store.resume();

    expect(callback.mock.calls.length).toEqual(2);
  });
});
