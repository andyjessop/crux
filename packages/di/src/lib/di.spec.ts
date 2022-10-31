import { di } from './di';

let services = {
  a: { factory: () => Promise.resolve(createA), deps: [] },
  b: { factory: () => Promise.resolve(createB), deps: [] },
  c: { factory: () => Promise.resolve(createC), deps: ['a'] },
  f: { factory: () => Promise.resolve(createF), deps: ['a', 'x'] },
};

let container = di(services);

describe('di', () => {
  beforeEach(() => {
    services = {
      a: { factory: () => Promise.resolve(createA), deps: [] },
      b: { factory: () => Promise.resolve(createB), deps: [] },
      c: { factory: () => Promise.resolve(createC), deps: ['a'] },
      f: { factory: () => Promise.resolve(createF), deps: ['a', 'x'] },
    };

    container = di(services);
  });

  test('should register services', async () => {
    expect((await container.get('a')).get()).toEqual('a');
    expect((await container.get('b')).get()).toEqual('b');
    expect((await container.get('c')).get()).toEqual('ca');

    // f is invalid
    let err = null;

    try {
      (await container.get('f')).get();
    } catch (error) {
      err = error;
    }

    expect(err).toEqual('Service f does not exist.');
  });

  test('should remove a service', async () => {
    container.remove('b');

    let err = null;

    try {
      (await container.get('b')).get();
    } catch (error) {
      err = error;
    }

    expect(err).toEqual('Service b does not exist.');
  });

  test('should not remove a service if another is dependent on it', async () => {
    expect(container.remove('a')).toEqual(null);

    expect((await container.get('a')).get()).toEqual('a');
  });

  test('should get a singleton', () => {
    const a1 = container.getSingleton('a');
    const a2 = container.getSingleton('a');

    expect(a1 === a2).toEqual(false);
  });

  test('should not instantiate dependencies as singletons', async () => {
    const c1 = container.getSingleton('c');
    const a = await container.get('a');

    a.set('x');

    const c2 = container.getSingleton('c');

    expect(c1 === c2).toEqual(false);
    expect(a.getStr()).toEqual('x');
  });

  test('should not instantiate dependencies as singletons (2)', async () => {
    const c1 = await container.get('c');
    const c2 = await container.get('c');

    expect(c1 === c2).toEqual(true);
  });
});

function createA() {
  let strA: string;

  return {
    get: () => 'a',
    getStr: () => strA,
    set: (str: string) => {
      strA = str;
      return strA;
    },
  };
}

function createB() {
  return {
    get: () => 'b',
    set: (str: 'b') => 'b',
  };
}

function createC(a: ReturnType<typeof createA>) {
  return {
    get: () => `c${a.get()}`,
    set: (str: 'c') => `c${a.set(str)}`,
  };
}

function createF(a: ReturnType<typeof createA>, b: ReturnType<typeof createB>) {
  return b;
}
