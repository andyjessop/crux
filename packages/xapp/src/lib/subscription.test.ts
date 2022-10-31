import { service } from './service';
import { subscription } from './subscription';

const mockA = jest.fn();

describe('service', () => {
  beforeEach(() => {
    mockA.mockClear();
  });

  test('calls handler with dependencies', async () => {
    const sA = service(() => Promise.resolve(serviceA()));
    const a = subscription(() => Promise.resolve(subscriptionA), {
      deps: [sA, selectorA],
    });

    expect(a.instance).toBeUndefined();
    expect(a.promise).toBeUndefined();

    const promiseA = a.getInstance();

    expect(promiseA.then).not.toBeUndefined();

    await promiseA;

    await a.runSubscription({ a: 'a' });

    expect(mockA.mock.calls[0][0]).toEqual({
      isA: true,
      a: 'a',
    });
  });

  test('does not call handler if inputs have not changed', async () => {
    const sA = service(() => Promise.resolve(serviceA()));
    const a = subscription(() => Promise.resolve(subscriptionA), {
      deps: [sA, selectorA],
    });

    await a.getInstance();

    const state = { a: 'a' };

    await a.runSubscription(state);
    await a.runSubscription(state); // same call

    expect(mockA.mock.calls.length).toEqual(1);

    mockA.mockClear();

    const nestedState = { a: { nested: 'a' } };

    await a.runSubscription(nestedState);
    await a.runSubscription(nestedState);

    expect(mockA.mock.calls.length).toEqual(1);
  });

  test('calls handler again if state is new reference', async () => {
    const sA = service(() => Promise.resolve(serviceA()));

    const a = subscription(() => Promise.resolve(subscriptionA), {
      deps: [sA, selectorA],
    });

    await a.getInstance();

    await a.runSubscription({ a: { nested: 'a' } });
    await a.runSubscription({ a: { nested: 'a' } }); // same call but different reference

    expect(mockA.mock.calls.length).toEqual(2);
  });
});

function serviceA() {
  return {
    isA: true,
  };
}

function selectorA(state: any) {
  return state.a;
}

function subscriptionA(service: ReturnType<typeof serviceA>, value: ReturnType<typeof selectorA>) {
  mockA({
    isA: service.isA,
    a: value,
  });
}
