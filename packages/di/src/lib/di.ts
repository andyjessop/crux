import { allDependenciesExist } from './all-dependencies-exist';
import { byDependency } from './by-dependency';
import { getDependents } from './get-dependents';
import { createEventEmitter, EventEmitter } from '@crux/event-emitter';

export type Constructor<T> = (...args: any[]) => T;

export type ConstructorTuple<T, U> = [Constructor<T>, ...U[]];

export type ConstructorCollection<T> = Partial<
  Record<
    keyof T,
    | Constructor<T[keyof T]>
    | ConstructorTuple<T[keyof T], keyof T | SingletonDefinition<T>>
  >
>;

export type SingletonDefinition<T> = { constructor: keyof T; singleton: true };

export type ConstructorCollectionTuple<T> = [
  keyof T,
  Constructor<T[keyof T]> | ConstructorTuple<T[keyof T], keyof T>
];

export type Model<T> = {
  constructor: Constructor<T[keyof T]>;
  dependencies: (keyof T)[];
  instance?: T[keyof T] & { destroy?: () => void };
  name: keyof T;
  order: number;
};

export type Collection<T> = Partial<Record<keyof T, Model<T>>>;

export type Events = {
  InstanceCreated: unknown;
};

export type DI<T> = {
  add: (
    name: keyof T,
    constructor: Constructor<T[keyof T]> | ConstructorTuple<T[keyof T], keyof T>
  ) => boolean;
  get<V extends keyof T>(name: V): T[V];
  getSingleton<V extends keyof T>(name: V): T[V];
  remove: (name: keyof T) => true | null;
} & EventEmitter<Events>;

export function di<T>(initialServices?: ConstructorCollection<T>): DI<T> {
  const emitter = createEventEmitter<Events>();
  const services: Collection<T> = {};

  if (initialServices) {
    (<ConstructorCollectionTuple<T>[]>Object.entries(initialServices))
      // ensure dependent constructors are added after independent constructors
      .sort(byDependency)
      .forEach(([key, service]) => {
        add(key, service);
      });
  }

  return {
    add,
    ...emitter,
    get,
    getSingleton,
    remove,
  };

  function add(
    name: keyof T,
    constructor: Constructor<T[keyof T]> | ConstructorTuple<T[keyof T], keyof T>
  ): boolean {
    if (services[name]) {
      return false;
    }

    const order = Object.keys(services).length;

    if (typeof constructor === 'function') {
      services[name] = {
        constructor,
        dependencies: [],
        name,
        order,
      };
    } else {
      const [constructorFn, ...dependencies] = constructor;

      if (!allDependenciesExist(services, dependencies)) {
        return false;
      }

      services[name] = {
        constructor: constructorFn,
        dependencies,
        name,
        order,
      };
    }

    return true;
  }

  function get<U extends keyof T>(name: U): T[U] {
    if (!services[name]) {
      throw new Error(`Service ${name} does not exist.`);
    }

    if (!services[name]?.instance) {
      instantiate(name);
    }

    return <T[U]>services[name]?.instance;
  }

  function getSingleton<U extends keyof T>(name: U): T[U] {
    if (!services[name]) {
      throw new Error(`Service ${name} does not exist.`);
    }

    return instantiate(name, true);
  }

  function instantiate<U extends keyof T>(name: U, singleton = false): T[U] {
    if (!services[name]) {
      throw new Error('Service does not exist');
    }

    if ((<Model<T>>services[name]).instance && !singleton) {
      return <T[U]>services[name]?.instance;
    }

    const dependencies = services[name]?.dependencies;

    const instantiatedDependencies = dependencies
      ? <T[keyof T][]>(
          services[name]?.dependencies?.map(toInstantiatedDependency)
        )
      : [];

    const instance = (<Model<T>>services[name]).constructor(
      ...instantiatedDependencies
    );

    if (!singleton) {
      (<Model<T>>services[name]).instance = instance;
    }

    emitter.emit('InstanceCreated', instance);

    return <T[U]>instance;
  }

  function remove(name: keyof T): true | null {
    if (!services[name]) {
      return null;
    }

    if (getDependents(name, services).length) {
      return null;
    }

    services[name]?.instance?.destroy?.();

    delete services[name];

    return true;
  }

  function toInstantiatedDependency(
    dependency: keyof T | SingletonDefinition<T>
  ) {
    if (typeof (<keyof T>dependency) === 'string') {
      return instantiate(<keyof T>dependency);
    }

    return instantiate((<SingletonDefinition<T>>dependency).constructor, true);
  }
}
