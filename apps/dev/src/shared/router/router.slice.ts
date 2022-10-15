import { createSlice } from "@crux/redux-slice";
import { merge } from '@crux/utils';
import { getRouteFromUrl } from "./utils/get-route-from-url";
import { getUrlFromRoute } from "./utils/get-url-from-route";

export type Route<T extends Record<string, string> = any> = { name: keyof T, hash?: string, params?: Record<string, string>, search?: Record<string, string> };

export interface RouterState {
  route: Route | null;
}

export type RouterAPI = ReturnType<typeof createRouterSlice>['api'];

export function createRouterSlice<
  T extends Record<string, string>
>(config: T) {
  type RouterSlice = {
    navigate: Route<T>;
    navigateSuccess: Route;
    onPopstate: void;
  };

  const initialState = {
    route: getRouteFromUrl(config, window.location.href)
  };

  const slice = createSlice<RouterSlice>()('router', initialState, {
    navigateSuccess: (state, route) => merge(state, {
      route,
    }),

    navigate: (state, { hash, name, search, params }) => ({ api }) => {
      const url = getUrlFromRoute(config, name, params, search, hash);

      window.history.pushState({}, '', url);
      
      api.navigateSuccess({
        hash,
        name,
        params,
        search
      });
    },

    onPopstate: () => ({ api }) => {
      const route = getRouteFromUrl(config, window.location.href);

      api.navigateSuccess(route);
    },
  });

  addEventListener('popstate', () => {
    slice.api.onPopstate();
  });

  return slice;
}