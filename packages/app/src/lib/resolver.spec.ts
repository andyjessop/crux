import { createResolver } from './resolver';

let services = {
  a: { factory: () => Promise.resolve(serviceA), deps: [] },
  b: { factory: () => Promise.resolve(serviceB), deps: [] },
};

let modules = {
  d: { factory: () => Promise.resolve(moduleD), deps: ['c.serviceE'] },
  c: { factory: () => Promise.resolve(moduleC), deps: ['a'] },
};

let resolver = createResolver(services, modules);

describe('di', () => {
  beforeEach(() => {
    services = {
      a: { factory: () => Promise.resolve(serviceA), deps: [] },
      b: { factory: () => Promise.resolve(serviceB), deps: [] },
    };
    
    modules = {
      d: { factory: () => Promise.resolve(moduleD), deps: ['c.serviceE'] },
      c: { factory: () => Promise.resolve(moduleC), deps: ['a'] },
    };

    resolver = createResolver(services, modules);
  });

  test('should get services', async () => {
    expect((await resolver.get('a')).isServiceA).toEqual(true);
    expect((await resolver.get('b')).isServiceB).toEqual(true);
    expect((await resolver.getModule('c')).services.serviceE).not.toBeUndefined();

    const d = await resolver.getModule('d');

    expect(d.canAccessServiceE).toEqual(true);
    
  });
});

function serviceA() {
  return {
    isServiceA: true
  }
}

function serviceB() {
  return {
    isServiceB: true
  };
}

function moduleC(a: ReturnType<typeof serviceA>) {
  return {
    services: {
      serviceE: {
        factory: () => Promise.resolve(() => ({ 
          isServiceE: true
         })),
      },
    }
  };
}

function moduleD(serviceE: any) {
  return {
    canAccessServiceE: serviceE.isServiceE
  };
}
