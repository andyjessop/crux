import type * as Container from '../../di/types';
import type { Model } from './types';
import type { CruxContainer } from '../types';
import type { Router } from '../../../lib/router';

export function createCruxRouterAdapter<T>(
  crux: CruxContainer<T>,
  app: Container.API<T>,
): Model {
  const router = <Router.API><unknown>app.get(<keyof T>'router');
  const dispatch = crux.get('dispatch');

  router.addListener('transition', onRouteTransition);

  /* Associate modules with routes. Add/remove modules according to route.
  // When adding module: dd it to the route map for ALL routes if no routes have been specified.
    routeMap.set(toRouteString('all'), (<string[]>routeMap.get(toRouteString('all'))).concat(name));

    if (typeof constructor === 'object') {
      const { module, routes } = constructor;

      if (!module || !routes?.length) {
        return null;
      }

      routes
        // Map to stringified route name and params
        .map(toRouteString)
        // Add to routeMap as individual entries
        .forEach((routeString) => {
          if (!routeMap.get(routeString)) {
            routeMap.set(routeString, []);
          }

          // Add it to the route map for this route.
          routeMap.set(routeString, (<string[]>routeMap.get(routeString)).concat(name));
        });

      constructorsMap.set(name, module);

      return true;
    }
    */
  return {
    destroy,
  };

  function destroy() {
    router.removeListener('transition', onRouteTransition);
  }

  function onRouteTransition() {
    const currentRoute = router.getCurrentRoute();

    // Deactivate old modules
    // Activate new modules
    /*
    const allRouteModules = routeMap.get(toRouteString('all')) || [];
    const currentRouteModules = routeMap.get(toRouteString(route)) || [];

    const moduleNames = new Set((<string[]>[]).concat(allRouteModules).concat(currentRouteModules));

    // Remove any active modules that are not relevant to this route
    activeModulesMap.forEach((module, name) => {
      if (!moduleNames.has(name)) {
        remove(name);
      }
    });

    moduleNames.forEach(async (name) => {
      activate(name);
    });

    return true;
    */
  
    dispatch('router', 'transition', currentRoute);
  }
}

function toRouteString(route: string | Router.RouteData) {
  const routeObj = typeof route === 'object' ? route : { name: route, params: null };

  return JSON.stringify(routeObj, replacer);
}

function replacer(k: string, value: any) {
  return value instanceof Object && !(value instanceof Array)
    ? Object.keys(value)
        .sort()
        .reduce((sorted: any, key) => {
          sorted[key] = value[key];
          return sorted;
        }, {})
    : value;
}