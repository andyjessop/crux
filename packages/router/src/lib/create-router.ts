import { createEventEmitter } from '@crux/utils';
import type { EventEmitter } from '@crux/utils';
import { parse, reverse } from './parser';
import { trimSlashes } from './parser/trim-slashes';
import { getRouteData } from './helpers/get-route-data';
import { buildEvent } from './helpers/build-event';
import { paramsToStrings } from './helpers/params-to-strings';

export type RouteParams = Record<string, string | null | string[]>;

export interface Route {
  decodeURL(url: string): null | RouteParams;
  encodeURL(dict: RouteParams): string;
  name: string;
}

export interface Router extends EventEmitter<Events> {
  back(): void;
  destroy(): void;
  forward(): void;
  getCurrentRoute(): RouteData | null;
  go(num: number): void;
  navigate(name: string, params?: RouteParams): void;
  register(name: string, path: string): true | null;
  replace(name: string, params?: RouteParams): void;
}

export interface CurrentRoute {
  params: any;
  route: Route;
}

export interface TransitionEvent<T extends keyof Events> {
  last: RouteData | null,
  next: RouteData | null,
  type: T,
}

export type Events = {
  afterTransition: TransitionEvent<'afterTransition'>,
  beforeTransition: TransitionEvent<'beforeTransition'>,
  didTransition: TransitionEvent<'didTransition'>,
  transitionFailed: TransitionEvent<'transitionFailed'>,
  willTransition: TransitionEvent<'willTransition'>,
};

export interface RouteData {
  name: string;
  params: any;
}

export type Routes = Record<string, Route>;

export type RoutesConfig = Record<string, string>;

export type Constructor = (baseRoute: string, config: RoutesConfig) => Router;

/**
 * Create a router.
 */
export function createRouter(
  base: string,
  initialRoutes: RoutesConfig,
  emitter: EventEmitter<Events> = createEventEmitter(),
): Router {
  const trimmedBase = trimSlashes(base);
  const routes: Routes = {};

  // Register the initial routes, including the "root" route.
  [['root', '/'], ['notFound', '/404'], ...Object.entries(initialRoutes)].forEach(([name, path]) =>
    register(name, path),
  );

  let currentRoute: CurrentRoute | null = getMatchingRoute(window.location.href);

  navigate(currentRoute.route.name, currentRoute.params);

  window.addEventListener('popstate', refreshCurrentRoute);

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
    window.removeEventListener('popstate', refreshCurrentRoute);
  }

  /**
   * Create a new route object on a given path.
   */
  function createRoute(name: string, path: string): Route {
    return {
      decodeURL: parse(path),
      encodeURL: reverse(path),
      name,
    };
  }

  /**
   * Get the current route.
   */
  function getCurrentRoute(): RouteData | null {
    return getRouteData(currentRoute);
  }

  /**
   * Get a route object matching a URL.
   */
  function getMatchingRoute(url: string): CurrentRoute {
    let params: any | null = null;

    const route = Object.values(routes).find((route) => {
      params = route.decodeURL(url);

      return params !== null;
    });

    if (!route) {
      return {
        params: null,
        route: routes.notFound,
      };
    }

    return {
      params,
      route,
    };
  }

  /**
   * Refresh the current route.
   */
  function refreshCurrentRoute() {
    const lastRoute = currentRoute;
    currentRoute = getMatchingRoute(window.location.href);
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
  async function navigate(name: string, params: RouteParams = {}): Promise<void> {
    const route = routes[name];

    if (!route) {
      return transition(routes['404']);
    }

    return transition(route, params);
  }

  /**
   * Register a route.
   */
  function register(name: string, path: string): true | null {
    if (typeof path === 'undefined' || typeof name === 'undefined') {
      return null;
    }

    routes[name] = createRoute(name, `${trimmedBase}${path}`);

    return true;
  }

  /**
   * Replace the current location history.
   */
  async function replace(name: string, params: RouteParams = {}): Promise<void> {
    const route = routes[name];

    if (!route) {
      return transition(routes['404']);
    }

    return transition(route, params, true);
  }

  /**
   * Transition to a new route.
   */
  async function transition(route: Route, params: RouteParams = {}, replace = false): Promise<void> {
    let url: string;
    const last = { ...getCurrentRoute() };
    const next = { name: route.name, params };

    await emitter.emit('beforeTransition', { last, next, type: 'beforeTransition' });

    try {
      // This is wrapped in a try/catch because encodeURL will throw if required parameters are not provided.
      url = route.encodeURL(paramsToStrings(params));
    } catch (e) {
      emitter.emit('transitionFailed', { last, next, type: 'transitionFailed' });

      return transition(routes.notFound);
    }

    if (!url) {
      emitter.emit('transitionFailed', { last, next, type: 'transitionFailed' });

      return transition(routes.notFound);
    }

    emitter.emit('willTransition', { last, next, type: 'willTransition' });

    const fullURL = `${window.location.origin}${url}`;

    if (fullURL === window.location.href) {
      return;
    }

    currentRoute = { params, route };

    if (replace) {
      window.history.replaceState({ name: route.name, params }, '', fullURL);
    } else {
      window.history.pushState({ name: route.name, params }, '', fullURL);
    }

    await emitter.emit('didTransition', { last, next, type: 'didTransition' });
    
    emitter.emit('afterTransition', { last, next, type: 'afterTransition' });
  }
}
