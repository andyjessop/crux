import { createEventEmitter, EventEmitter } from '@crux/event-emitter';
import { parse, reverse, trimSlashes } from '@crux/url-parser';
import { paramsToStrings } from './helpers/params-to-strings';

export type RouteParams = Record<string, string | null | string[]>;

export interface Route<T> {
  name: T;
  params: RouteParams;
}

export type Routes<T> = Record<keyof T, Route<T>>;

export type RoutesConfig<T> = Record<keyof T, string>;

export type Constructor<T> = (baseRoute: string, config: RoutesConfig<T>) => Router<T>;

export interface EncoderBase {
  decodeURL(url: string): null | RouteParams;
  encodeURL(dict: RouteParams): string;
}

export interface Encoder<N> extends EncoderBase {
  name: N;
}

export interface Router<T> extends EventEmitter<Events<keyof Encoders<T>>> {
  back(): void;
  destroy(): void;
  forward(): void;
  getCurrentRoute(): Route<keyof Encoders<T>> | null;
  go(num: number): void;
  navigate(name: keyof Encoders<T>, params?: RouteParams): Promise<void>;
  register(name: keyof Encoders<T>, path: string): Encoder<keyof Encoders<T>> | null;
  replace(name: keyof Encoders<T>, params?: RouteParams): Promise<void>;
}

type Encoders<T> = Record<keyof T, Encoder<keyof T>> & {
  root: Encoder<'root'>;
  notFound: Encoder<'notFound'>;
};

export interface FailedEvent<T, U extends keyof Events<T>> {
  current: Route<T> | null;
  next: Route<T> | null;
  type: U;
}

export interface PopStateEvent<T, U extends keyof Events<T>> {
  current: Route<T> | null;
  type: U;
}

export type Events<T> = {
  ready: PopStateEvent<T, 'ready'>;
  routeDidChange: PopStateEvent<T, 'routeDidChange'>;
  routeChangeFailed: FailedEvent<T, 'routeChangeFailed'>;
};

/**
 * Create a router.
 */
export function createRouter<T>(initialRoutes: RoutesConfig<T>, base = ''): Router<T> {
  const emitter = createEventEmitter<Events<keyof Encoders<T>>>();
  const trimmedBase = trimSlashes(base);

  // Register the initial routes, including the "root" route.
  const encoders: Encoders<T> = (<[keyof Encoders<T>, string][]>[
    ['root', '/'],
    ['notFound', '/404'],
    ...Object.entries(initialRoutes),
  ]).reduce((acc, [name, path]) => {
    const registered = register(<keyof Encoders<T>>name, path);

    if (!registered) {
      return acc;
    }

    // eslint-disable-next-line
    // @ts-ignore
    acc[name] = registered;

    return acc;
  }, <Encoders<T>>{});

  window.addEventListener('popstate', onRouteChange);

  onRouteChange();

  return {
    back,
    destroy,
    ...emitter,
    forward,
    getCurrentRoute,
    go,
    navigate,
    register,
    replace,
  };

  /**
   * Destroy the router.
   */
  function destroy() {
    window.removeEventListener('popstate', onRouteChange);
  }

  /**
   * Create a new route object on a given path.
   */
  function createEncoderBase(path: string): EncoderBase | null {
    if (typeof path === 'undefined') {
      return null;
    }

    const fullPath = `${trimmedBase}${path}`;

    return {
      decodeURL: parse(fullPath),
      encodeURL: reverse(fullPath),
    };
  }

  /**
   * Get the current route.
   */
  function getCurrentRoute(): Route<keyof Encoders<T>> | null {
    const matchingEncoder = getMatchingEncoder(window.location.href);

    if (!matchingEncoder) {
      return null;
    }

    const { name, decodeURL } = matchingEncoder;

    const params = decodeURL(window.location.href);

    if (!params) {
      return null;
    }

    return {
      name,
      params,
    };
  }

  /**
   * Get a route object matching a URL.
   */
  function getMatchingEncoder(url: string): Encoder<keyof Encoders<T>> | null {
    return (
      Object.values(encoders).find((e) => {
        return e.decodeURL(url);
      }) ?? encoders.notFound
    );
  }

  /**
   * Go forwards or backwards by a given number of steps.
   */
  function go(num: number) {
    window.history.go(num);
  }

  /**
   * Go backwards.
   */
  function back() {
    window.history.go(-1);
  }

  /**
   * Go forwards.
   */
  function forward() {
    window.history.go(1);
  }

  /**
   * Push a new route into the history.
   */
  async function navigate(name: keyof Encoders<T>, params: RouteParams = {}): Promise<void> {
    const encoder = encoders[name];

    if (!encoder) {
      return transition('notFound');
    }

    return transition(name, params);
  }

  async function onRouteChange() {
    const matchingEncoder = getMatchingEncoder(window.location.href);

    if (!matchingEncoder) {
      return;
    }

    const { name, decodeURL } = matchingEncoder;

    const params = decodeURL(window.location.href);

    if (!params) {
      return;
    }

    const current = {
      name,
      params,
    };

    await emitter.emit('routeDidChange', { current, type: 'routeDidChange' });

    emitter.emit('ready', { current, type: 'ready' });
  }

  /**
   * Register a route.
   */
  function register(name: keyof Encoders<T>, path: string): Encoder<keyof Encoders<T>> | null {
    if (typeof path === 'undefined' || typeof name === 'undefined') {
      return null;
    }

    const encoderBase = createEncoderBase(path);

    if (!encoderBase) {
      return null;
    }

    return {
      ...encoderBase,
      name,
    };
  }

  /**
   * Replace the current location history.
   */
  async function replace(name: keyof Encoders<T>, params: RouteParams = {}): Promise<void> {
    const encoder = encoders[name];

    if (!encoder) {
      return transition('notFound');
    }

    return transition(encoder.name, params, true);
  }

  /**
   * Transition to a new route.
   */
  async function transition(
    name: keyof Encoders<T>,
    params: RouteParams = {},
    replace = false
  ): Promise<void> {
    let url: string;
    const current = getCurrentRoute();
    const next = { name, params };

    try {
      const encoder = encoders[name];

      url = encoder.encodeURL(paramsToStrings(params));
    } catch (e) {
      emitter.emit('routeChangeFailed', {
        current,
        next,
        type: 'routeChangeFailed',
      });

      return transition('notFound');
    }

    if (!url) {
      emitter.emit('routeChangeFailed', {
        current,
        next,
        type: 'routeChangeFailed',
      });

      return transition('notFound');
    }

    const fullURL = `${window.location.origin}${url}`;

    if (fullURL === window.location.href) {
      return;
    }

    if (replace) {
      window.history.replaceState({ name, params }, '', fullURL);
    } else {
      window.history.pushState({ name, params }, '', fullURL);
    }

    onRouteChange();
  }
}
