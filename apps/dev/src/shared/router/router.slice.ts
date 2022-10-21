import { createSlice } from "@crux/redux-slice";
import { merge } from '@crux/utils';
import { getRouteFromUrl } from "./utils/get-route-from-url";
import { getUrlFromRoute } from "./utils/get-url-from-route";

export type Route<T extends Record<string, string> = any> = { name: keyof T & string, hash?: string, params?: Record<string, string>, search?: Record<string, string> };

export interface RouterState {
  route: Route | null;
}

export type RouterStateAPI = ReturnType<typeof createRouterSlice>['api'];

export function createRouterSlice<
  T extends Record<string, string>
>(config: T) {
  const initialState = {
    route: getRouteFromUrl(config, window.location.href)
  };

  const slice = createSlice('router', initialState, {
    navigateSuccess: (state: RouterState, route: Route<T>) => merge(state, {
      route,
    }),
  });

  return slice;
}