import { Route, Router } from '@crux/router';
import { AnyAction, Dispatch, MiddlewareAPI } from '@reduxjs/toolkit';
import { asymmetricDifference } from '../../utils/set/asymmetric-difference';


/**
 * Mounter middleware listens to route changes, destroys views that are no longer relevant,
 * and mounts views that are now relevant. 
 * 
 * Old mounter: https://github.com/andyjessop/crux/blob/05658ef3a222ea84fddd39def1a6f890852e2531/packages/app/src/lib/mounter/mounter.ts
 */
export function createMounterMiddlware<Routes, Regions>(views: ViewConfig<Routes, Regions>, router: Router<Routes>) {
  type RouteKeys = keyof Routes | "root" | "notFound";

  // route1: Set['region1', 'region2'],
  // route2: Set['region2', 'region3'],
  const config = new Map<RouteKeys, Set<keyof Regions>>();

  for (const [route, regions] of (Object.entries(views) as [RouteKeys, RegionConfig<Regions>][])) {
    const regionsAsArray = new Set<keyof Regions>(Object.keys(regions) as (keyof typeof regions)[]);

    config.set(route, regionsAsArray);
  }
  
  return (api: MiddlewareAPI) => (next: Dispatch<AnyAction>) => (action: AnyAction) => {
    const currentRoute = router.getCurrentRoute();

    if (action.type === 'router/_navigated') {
      const newRoute: Route<RouteKeys> = action.payload;

      // Unmount views that are in old but not in new - for current route
      const toUnmount = asymmetricDifference(
        config.get(currentRoute.name),
        config.get(newRoute.name),
      );

      for (const region of toUnmount) {
        views[currentRoute.name]?.[region]?.unmount();
      }
      
      // Mount views that are in new but not in old - for new route
      const toMount = asymmetricDifference(
        config.get(newRoute.name),
        config.get(currentRoute.name),
      );

      for (const region of toMount) {
        views[newRoute.name]?.[region]?.mount();
      }
    }

    next(action);
  };
}

type View = { unmount: () => void; mount: () => void };
type ViewConstructor = (...args: any[]) => Promise<View>;
type RegionConfig<Regions> = Record<keyof Regions, ViewConstructor>
type ViewConfig<Routes, Regions> = Record<keyof Routes |  "root" | "notFound", RegionConfig<Regions>>;

/**
 * @example
 * 
 * views: {
 *   home: {
 *     nav: createNav,
 *     main: createMain,
 *   },
 *   about: {
 *     nav: createNav,
 *     sidebar: createSidebar,
 *   }
 * }
 * 
 * flattenViews(views);
 * 
 * // becomes:
 * 
 * home.nav: createNav,
 * home.main: createMain,
 * about.nav: createNav,
 * about.sidebar: createSidebar,
 */
function flattenViews<Routes, Regions>(views: ViewConfig<Routes, Regions>) {
  
}