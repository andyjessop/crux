import { allDependenciesExist } from './all-dependencies-exist';
import { sortByDependency } from './by-dependency';
import { getDependents } from './get-dependents';

export type Options<T> = { service: keyof T; singleton: true };

export type Service<T> = { factory: Factory, deps?: (keyof T & string)[] };
export type ServiceCollection = {
  [key: string]: { factory: Factory, deps?: string[] }
};

type Constructor = (...args: any[]) => any;
type Factory = () => Promise<Constructor>;

export type Model<T> = {
  factory: Factory,
  deps: (keyof T)[],
  instance?: any;
  name: keyof T,
  order: number,
}

export function di<T>(initialServices: T) {
  type Instance<K extends keyof T> = T[K] extends {factory: (() => Promise<(...args: any[]) => infer R>), deps?: string[] }
  ? R : any;
  const services = new Map<string, Model<T>>();  

  if (initialServices) {
    const sorted = sortByDependency(Object.entries(initialServices));

    sorted.forEach(([key, service]) => {
      register(key as (keyof T & string), service);
    });
  }

  return {
    get,
    getSingleton,
    register,
    remove,
  };

  function register(
    name: keyof T,
    service: Service<T>
  ): boolean {
    if (services.get(name as string)) {
      return false;
    }

    const order = Object.keys(services).length;

    const { factory, deps = [] } = service;

      if (!allDependenciesExist<T>(services, deps)) {
        return false;
      }

      services.set(name as string, {
        factory,
        deps,
        name,
        order,
      });

    return true;
  }

  async function get<Key extends keyof T & string>(name: Key): Promise<Instance<Key>> {
    if (!services.has(name)) {
      throw `Service ${name} does not exist.`;
    }

    if (!services.get(name)?.instance) {
      await instantiate(name);
    }

    return services.get(name)?.instance as Instance<Key>;
  }

  async function getSingleton<Key extends keyof T & string>(name: Key) {
    if (!services.get(name)) {
      throw new Error(`Service ${name} does not exist.`);
    }

    return instantiate(name, true);
  }

  async function instantiate<Key extends keyof T>(name: Key, singleton = false): Promise<Instance<Key>> {
    if (!services.get(name as string)) {
      throw new Error('Service does not exist');
    }

    const service = services.get(name as string) as Model<T>;

    if (service.instance && !singleton) {
      return service.instance;
    }

    const deps = service.deps;

    const instantiatedDependencies = await Promise.all(
      deps.map(dep => instantiate(dep))
    );

    // All services are defined with a Promise.
    const constuctor = await service.factory();

    const instance = await constuctor(
      ...instantiatedDependencies
    );

    if (!singleton) {
      service.instance = instance;
    }

    return instance as Instance<Key>;
  }

  function remove(name: keyof T & string): true | null {
    if (!services.has(name)) {
      return null;
    }

    // Do not remove if service has dependents.
    if (getDependents(name, services).length) {
      return null;
    }

    const service = services.get(name) as Model<T>;

    service.instance?.destroy?.();

    services.delete(name);

    return true;
  }
}