import { ConstructorCollection, DI, di } from './di';

interface Services {
  a: {
    get: () => string;
    getStr: () => string;
    set: (str: string) => string;
  };
  b: {
    get: () => string;
    set: (str: 'b') => string;
  };
  c: {
    get: () => string;
    set: (str: 'c') => string;
  };
  d: {
    get: () => string;
    set: (str: 'd') => string;
  };
  e: {
    get: () => string;
    set: (str: 'e') => string;
  };
  f: {
    get: () => string;
    set: (str: 'b') => string;
  };
}
let initialServices: ConstructorCollection<Services>;
let container: DI<Services>;

describe('di', () => {
  beforeEach(() => {
    initialServices = {
      a: createA,
      b: createB,
      c: [createC, 'a'],
      f: [createF, 'a', { constructor: 'b', singleton: true }],
    };

    container = di(initialServices);
  });

  test('should register services', () => {
    expect(container.get('a').get()).toEqual('a');
    expect(container.get('b').get()).toEqual('b');
    expect(container.get('c').get()).toEqual('ca');
  });

  test('should add a service', () => {
    container.add('d', createD);

    expect(container.get('d').get()).toEqual('d');
  });

  test('should add a service with a dependency', () => {
    container.add('e', [createE, 'b']);

    expect(container.get('e').get()).toEqual('eb');
  });

  test('should return false if dependency does not exist', () => {
    expect(container.add('d', [createD, <keyof Services>'x'])).toEqual(false);
    expect(() => container.get('d')).toThrow();
  });

  test('should remove a service', () => {
    container.remove('b');

    expect(() => container.get('b')).toThrow();
  });

  test('should not remove a service if another is dependent on it', () => {
    expect(container.remove('a')).toEqual(null);

    expect(container.get('a').get()).toEqual('a');
  });

  test('should get a singleton', () => {
    const a1 = container.getSingleton('a');
    const a2 = container.getSingleton('a');

    expect(a1 === a2).toEqual(false);
  });

  test('should not instantiate dependencies as singletons', () => {
    const c1 = container.getSingleton('c');
    const a = container.get('a');

    a.set('x');

    const c2 = container.getSingleton('c');

    expect(c1 === c2).toEqual(false);
    expect(a.getStr()).toEqual('x');
  });

  test('should not instantiate dependencies as singletons (2)', () => {
    const c1 = container.get('c');
    const c2 = container.get('c');

    expect(c1 === c2).toEqual(true);
  });

  test('should instantiate dependencies as singletons if defined', () => {
    const b = container.get('b');
    const f = container.get('f');

    expect(b === f).toEqual(false);
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

function createC(a: any) {
  return {
    get: () => `c${a.get()}`,
    set: (str: 'c') => `c${a.set(str)}`,
  };
}

function createD() {
  return {
    get: () => 'd',
    set: (str: 'd') => 'd',
  };
}

function createE(b: any) {
  return {
    get: () => `e${b.get()}`,
    set: (str: 'e') => `e${b.set(str)}`,
  };
}

function createF(a: any, b: any) {
  return b;
}
