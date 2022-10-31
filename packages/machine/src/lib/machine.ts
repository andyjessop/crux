import { createEventEmitter, EventEmitter, EventHandler } from '@crux/event-emitter';

export function machine<T extends Config>(config: T, options: Options<T>) {
  const { emitter = createEventEmitter<Events<T>>(), initialState } = options;
  const secEmitter = createEventEmitter<StateEvents<T>>();

  let current = initialState;

  const actions = buildActions(config, transition);
  const handlers = buildHandlers(config, secEmitter);

  return {
    ...actions,
    getState,
    ...handlers,
    onEnter,
    onExit,
    transition,
  };

  function getState() {
    return current;
  }

  function onEnter(handler: (data: Events<T>['onEnter']) => Promise<void> | void) {
    emitter.on(EventTypes.OnEnter, handler);

    return function offEnter() {
      emitter.off(EventTypes.OnEnter, handler);
    };
  }

  function onExit(handler: (data: Events<T>['onExit']) => Promise<void> | void) {
    emitter.on(EventTypes.OnExit, handler);

    return function offEnter() {
      emitter.off(EventTypes.OnExit, handler);
    };
  }

  async function transition(
    action: Actions<T>,
    ...meta: unknown[]
  ): Promise<(keyof T & string) | undefined> {
    await emitter.emit(EventTypes.OnExit, { action, current, meta });

    const last = current;

    if (!config[current][action]) {
      return;
    }

    current = await config[current][action](meta);

    await emitter.emit(EventTypes.OnEnter, { action, current, last, meta });
    await secEmitter.emit(current, {
      action,
      current,
      last: last as Exclude<keyof T, keyof T & string>,
      meta,
    });

    return current;
  }
}

function buildActions<T extends Config>(config: T, transition: Transition<T>) {
  return Array.from(
    Object.values(config).reduce((acc, stateConfig) => {
      Object.keys(stateConfig).forEach((key) => acc.add(<Actions<T>>key));

      return acc;
    }, new Set<Actions<T>>())
  ).reduce((acc, action) => {
    acc[action] = function doTransition(...meta: unknown[]) {
      return transition(action, ...meta);
    };

    return acc;
  }, <Record<Actions<T>, (...meta: unknown[]) => Promise<(keyof T & string) | undefined>>>{});
}

function buildHandlers<T extends Config>(config: T, emitter: EventEmitter<StateEvents<T>>) {
  const keys = Object.keys(config) as (keyof T)[];

  return keys.reduce((acc, cur: any) => {
    const first = cur.slice(0, 1);
    const rest = cur.slice(1).split('');

    const k = `on${first.toUpperCase()}${rest.join('')}` as `on${Capitalize<
      Extract<keyof T, string>
    >}`;

    acc[k] = (handler: EventHandler<StateEvents<T>[keyof T]>) => {
      emitter.on(cur, handler);

      return () => emitter.off(cur, handler);
    };

    return acc;
  }, <Record<`on${Capitalize<keyof T & string>}`, (handler: EventHandler<StateEvents<T>[keyof T]>) => () => void>>{});
}

type Config = {
  [key: string]: Record<string, (...params: any[]) => Promise<string> | string>;
};

export type Events<T> = {
  onEnter: { action: Actions<T>; current: keyof T; meta?: unknown; last: keyof T };
  onExit: { action: Actions<T>; current: keyof T; meta?: unknown };
};

type StateEvents<T> = {
  [K in keyof T]: { action: Actions<T>; current: K; meta?: unknown; last: Exclude<keyof T, K> };
};

export const enum EventTypes {
  OnEnter = 'onEnter',
  OnExit = 'onExit',
}

type Options<T> = {
  emitter?: EventEmitter<Events<T>>;
  initialState: keyof T & string;
};

type NestedKeys<T> = T extends object ? { [K in keyof T]-?: K | NestedKeys<T[K]> }[keyof T] : never;

type Transition<T> = (
  action: Actions<T>,
  meta?: unknown
) => Promise<(keyof T & string) | undefined>;

type Actions<T> = Exclude<NestedKeys<T>, keyof T>;
