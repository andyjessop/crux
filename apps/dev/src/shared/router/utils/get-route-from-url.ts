import type { Route } from "../router.slice";

export function getRouteFromUrl(config: Record<string, string>, fullUrl: string): Route | null {
  const { hash, pathname, searchParams } = new URL(fullUrl);

  const pathnameTokens = pathname.split('/');

  const params = {} as Record<string, string>;

  const name = Object.entries(config).find(([name, path]) => {
    const pathTokens = path.split('/');

    if (pathTokens.length !== pathnameTokens.length) {
      return false;
    }

    return pathTokens.every((token, index) => {
      if (token.startsWith(':')) {
        params[token.replace(':', '')] = pathnameTokens[index];

        return true;
      }

      return token === pathnameTokens[index];
    });
  })?.[0];

  return name ? {
    hash,
    name,
    params: Object.keys(params).length ? params : undefined,
    search: Object.fromEntries(searchParams.entries()),
  } : null;
}
