import { CurrentRoute, RouteData } from '../create-router';

export function getRouteData(
  route: CurrentRoute | null | undefined,
): RouteData | null {
  if (!route) {
    return null;
  }

  return { name: route.route.name, params: route.params };
}
