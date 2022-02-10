import { createEventEmitter, EventEmitter } from "@crux/event-emitter";

interface Store<T> {
  getState(): T;
  pause(): boolean;
  resume(): boolean;
  subscribe(callback: () => void): () => boolean;
}

export interface Layout<T, U> {
  update(state: T): {
    regions: U[];
    render(root: HTMLElement): boolean;
  };
}

export interface Module<T> {
  create?(state: T): void;
  destroy?(state: T): void;
}

export interface Modules<T, U> {
  getMany(keys: U[]): Module<T>[];
}

export enum Event {
  Create = 'create',
  Destroy = 'destroy',
  OnModulesCreated = 'onModulesCreated',
  OnModulesDestroyed = 'onModulesDestroyed',
  onNewState = 'onNewState',
  onNewRegions = 'onNewRegions'
}

export type Events<T, U> = {
  [Event.Create]: {core: Core<T, U> },
  [Event.Destroy]: {core: Core<T, U> },
  [Event.OnModulesCreated]: { core: Core<T, U>, modules: Module<T>[] },
  [Event.OnModulesDestroyed]: { core: Core<T, U>, modules: Module<T>[] },
  [Event.onNewState]: { state: T, core: Core<T, U> },
  [Event.onNewRegions]: { regions: U[], core: Core<T, U> }
}

export interface Core<T, U> {
  destroy: () => void;
  modules: Map<U, Module<T>>;
  onStateUpdate: () => Promise<boolean>;
}

export function createCore<T, U = unknown>(store: Store<T>, layout: Layout<T, U>, root: HTMLElement, eventEmitter?: EventEmitter<Events<T, U>>) {
  const emitter = eventEmitter || createEventEmitter<Events<T, U>>();
  const unsubscribe = store.subscribe(onStateUpdate);
  const modules = new Map<U, Module<T>>();
  const currentRegions: U[] = [];

  const core = {
    destroy,
    modules,
    onStateUpdate,
  }

  emitter.emit(Event.Create, { core });

  return core;
  
  function destroy() {
    unsubscribe();

    emitter.emit(Event.Destroy, { core });
  }

  async function onStateUpdate() {
    const newState = store.getState();

    emitter.emit(Event.onNewState, { state: newState, core });

    // call layout with state to get regions.
    const { regions, render } = layout.update(newState);

    // get difference between regions.
    const {
      extraInFirst: currentRegionsToRemove,
      extraInSecond: newRegionsToAdd
    } = difference(currentRegions, regions);

    // if newRegions is same as oldRegions, do nothing.
    if (currentRegionsToRemove.length === 0 && newRegionsToAdd.length === 0) {
      return false;
    }

    currentRegions.length = 0;
    currentRegions.push(...regions);

    emitter.emit(Event.onNewRegions, { core, regions });

    const modulesToDestroy = getMany(modules, currentRegionsToRemove);

    // destroy modules whose region no longer exists
    await Promise.all(
      modulesToDestroy.map(mod => mod.destroy?.(newState))
    );

    emitter.emit(Event.OnModulesDestroyed, { core, modules: modulesToDestroy });

    // call layout render function
    render(root);

    const modulesToCreate = getMany(modules, newRegionsToAdd);

    // Initialise new modules
    await Promise.all(
      modulesToCreate.map(mod => mod.create?.(newState))
    );

    emitter.emit(Event.OnModulesCreated, { core, modules: modulesToCreate });

    return true;
  }
}

function difference<T>(arrA: T[], arrB: T[]) {
  const extraInFirst = [];
  const extraInSecond = [];

  for (const entry of arrA) {
    if (!arrB.includes(entry)) {
      extraInFirst.push(entry);
    }
  }

  for (const entry of arrB) {
    if (!arrA.includes(entry)) {
      extraInSecond.push(entry);
    }
  }
  
  return {
    extraInFirst,
    extraInSecond,
  };
}

function getMany<T, U>(map: Map<T, U>, keys: T[]): U[] {
  const entries = map.entries();

  const ret: U[] = [];

  for (const entry of entries) {
    if (keys.includes(entry[0])) {
      ret.push(entry[1]);
    }
  }

  return ret;
}