import type * as Adapters from './types';
import { createAdapters } from './create-adapters';
import type * as Container from '../../di/types';
import { createContainer } from '../../di';
import type { CruxContainer } from '../types';

interface Services {
  a: any;
}

let container: Container.API<Services>;
let crux: CruxContainer;
let initialModules: Adapters.ConstructorCollection<Services>;
let adapters: Adapters.API<Services>;

let actionAa: jest.Mock;
let actionBb: jest.Mock;
let destroyD: jest.Mock;

describe('modules', () => {
  beforeEach(async function setup() {
    container = createContainer(<Services>{
      a: () => jest.fn(),
    });

    crux = <CruxContainer>(<unknown>jest.fn());

    actionAa = jest.fn();
    actionBb = jest.fn();
    destroyD = jest.fn();

    initialModules = {
      a: (container) => {
        return {
          actions: {
            a: actionAa,
          },
          destroy: jest.fn(),
        };
      },
      b: () => {
        return {
          actions: {
            b: actionBb,
          },
          destroy: jest.fn(),
        };
      },
      c: (container) => import('./test/dynamic-import-c').then((mod) => mod.createC()),
      d: {
        module: () => {
          return {
            actions: {
              d: () => 'd',
            },
            destroy: destroyD,
          };
        },
        routes: ['d'],
      },
    };

    adapters = await createAdapters(initialModules, crux, container);
  });

  test('should register initial modules', () => {
    expect(adapters.get('a')?.actions?.a).toEqual(actionAa);
    expect(adapters.get('b')?.actions?.b).toEqual(actionBb);
    expect(adapters.get('d')).toBeUndefined();

    adapters.getDynamic('c')?.then((mod) => {
      expect(mod.actions?.c()).toEqual('c');
    });
  });

  test('should activate module when navigating to route', async function doTest() {
    await adapters.onRouteEnter({ name: 'd', params: null });

    expect(adapters.get('d')?.actions?.d()).toEqual('d');
  });

  test('should destroy module when navigating from route', async function doTest() {
    await adapters.onRouteEnter({ name: 'd', params: null });

    await adapters.onRouteEnter({ name: 'x', params: null });

    expect(destroyD.mock.calls.length).toEqual(1);
  });

  test('should add modules', () => {
    adapters.add('z', () => {
      return {
        actions: {
          z: () => 'z',
        },
      };
    });

    expect(adapters.get('z')?.actions?.z()).toEqual('z');

    adapters.add('e', () => import('./test/dynamic-import-e').then((mod) => mod.createE()));

    adapters.getDynamic('e')?.then((mod) => {
      expect(mod.actions?.e()).toEqual('e');
    });
  });

  test('should activate dynamic module when navigating to route', async function doTest() {
    adapters.add('e', {
      module: () => import('./test/dynamic-import-e').then((mod) => mod.createE()),
      routes: ['e'],
    });

    expect(adapters.getDynamic('e')).toBeUndefined();

    await adapters.onRouteEnter({ name: 'e', params: null });

    adapters.getDynamic('e')?.then((mod) => {
      expect(mod.actions?.e()).toEqual('e');
    });
  });

  test('should destroy dynamic module when navigating from route', async function doTest() {
    const callback = jest.fn();

    adapters.add('e', {
      module: () => import('./test/dynamic-import-e').then((mod) => mod.createE(callback)),
      routes: ['e'],
    });

    await adapters.onRouteEnter({ name: 'e', params: null });

    await adapters.onRouteEnter({ name: 'x', params: null });

    expect(callback.mock.calls.length).toEqual(1);
  });

  test('should not destroy module when navigating to second route', async function doTest() {
    const callback = jest.fn();

    adapters.add('e', {
      module: () => import('./test/dynamic-import-e').then((mod) => mod.createE(callback)),
      routes: ['e', 'f'],
    });

    await adapters.onRouteEnter({ name: 'e', params: null });

    await adapters.onRouteEnter({ name: 'f', params: null });

    expect(callback.mock.calls.length).toEqual(0);
  });

  test('should activate module when navigating to route with params', async function doTest() {
    const callback = jest.fn();

    adapters.add('e', {
      module: () => import('./test/dynamic-import-e').then((mod) => mod.createE(callback)),
      routes: ['f', { name: 'e', params: { x: true } }],
    });

    // Valid route
    await adapters.onRouteEnter({ name: 'e', params: { x: true } });

    await adapters.getDynamic('e')?.then((mod) => {
      expect(mod.actions?.e()).toEqual('e');
      expect(callback.mock.calls.length).toEqual(0);
    });

    // Valid route
    await adapters.onRouteEnter({ name: 'f', params: null });

    await adapters.getDynamic('e')?.then((mod) => {
      expect(mod.actions?.e()).toEqual('e');
      expect(callback.mock.calls.length).toEqual(0);
    });

    // Invalid route (no params)
    await adapters.onRouteEnter({ name: 'e', params: null });

    expect(adapters.getDynamic('e')).toBeUndefined();
    expect(callback.mock.calls.length).toEqual(1);
  });
});
