import { createEventEmitter, EventEmitter } from "@crux/utils";

export function createFSM<T extends Config>(config: T, options: Options<T>) {
  const {
    emitter = createEventEmitter<Events<T>>(),
    initialState,
  } = options;

  let current = initialState;

  const actions = buildActionMethods(config, transition);
  
  return {
    ...actions,
    getState,
    transition,
    ...emitter,
  };

  function getState() {
    return current;
  }

  async function transition(action: Actions<T>): Promise<keyof T & string> {
    await emitter.emit(EventTypes.OnExit, { action, current });

    const last = current;
    
    current = await config[current][action]();

    await emitter.emit(EventTypes.OnEnter, { action, current, last });

    return current;
  }
}

function buildActionMethods<T extends Config>(config: T, transition: Transition<T>) {
  return Array.from(
    Object.values(config).reduce((acc, stateConfig) => {
      Object.keys(stateConfig)
        .forEach(key => acc.add(<Actions<T>>key));

      return acc;
    }, new Set<Actions<T>>())
  ).reduce((acc, action) => {
    acc[action] = function doTransition() {
      return transition(action);
    };

    return acc;
  }, <Record<Actions<T>, () => Promise<keyof T & string>>>{});
}

type Config = {
  [key: string]: Record<string, () => Promise<string> | string>;
}

type Events<T> = {
  onEnter: { action: Actions<T>, current: string, last: string },
  onExit: { action: Actions<T>, current: string },
}

export const enum EventTypes {
  OnEnter = 'onEnter',
  OnExit = 'onExit',
  Ready = 'ready',
}

type Options<T> = {
  emitter?: EventEmitter<Events<T>>;
  initialState: keyof T & string;
}

type NestedKeys<T> =
  T extends object ? { [K in keyof T]-?: K | NestedKeys<T[K]> }[keyof T] : never;

type Transition<T> = (action: Actions<T>) => Promise<keyof T & string>;

type Actions<T> = Exclude<NestedKeys<T>, keyof T>;