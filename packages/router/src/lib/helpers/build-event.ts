import { getRouteData } from './get-route-data';
import { CurrentRoute, Events } from '../create-router';

/**
 * Build an event object.
 */
export function buildEvent<T extends keyof Events>({
  last,
  next,
  type,
}: {
  last: CurrentRoute | null | undefined;
  next: CurrentRoute | null | undefined;
  type: T;
}) {
  return {
    last: getRouteData(last),
    next: getRouteData(next),
    type,
  };
}
