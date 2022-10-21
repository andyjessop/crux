import type { Route, RouterStateAPI } from './router.slice';
import { getRouteFromUrl } from './utils/get-route-from-url';
import { getUrlFromRoute } from './utils/get-url-from-route';

export type RouterAPI = ReturnType<typeof router>;

export function router<T extends Record<string, string>>(config: T, api: RouterStateAPI) {
  addEventListener('popstate', () => {
    onPopstate();
  });

  return {
    navigate,
  };

  function navigate({ hash, name, search, params }: Route<T>, event?: Event) {
    event.preventDefault();

    const url = getUrlFromRoute(config, name, params, search, hash);

    window.history.pushState({}, '', url);
    
    api.navigateSuccess({
      hash,
      name,
      params,
      search
    });
  }

  function onPopstate() {
    const route = getRouteFromUrl(config, window.location.href);

    api.navigateSuccess(route);
  }
}