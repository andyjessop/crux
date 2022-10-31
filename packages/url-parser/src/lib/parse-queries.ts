import { RouteParams } from './types';
import { isList } from './is-list';
import { isOptional } from './is-optional';
import { paramName } from './param-name';
import { parseSegment } from './parse-segment';
import { SearchParams } from './types';

/**
 * Parse a query, returning a decodeURL function.
 */
export function parseQueries(target: SearchParams) {
  const keys = Array.from(target.keys());

  const parsers = keys
    .map((key) => {
      const segment = target.get(key);

      if (!segment) {
        return null;
      }

      return parseSegment(segment);
    })
    .filter((parser) => parser !== null);

  return function curriedParseQueries(query: SearchParams, params: RouteParams): boolean {
    const queryKeys = Array.from(query.keys());

    if (!keys.every((x) => isOptional(x) || isList(x) || queryKeys.includes(x))) {
      return false;
    }

    for (let i = 0; i < keys.length; i++) {
      const key = paramName(keys[i]);

      const q = query.get(key);

      if (!q) {
        return false;
      }

      if (isList(keys[i])) {
        Array.from(query.entries())
          .filter((x) => x[0] === key)
          .forEach((x) => parsers[i]?.(x[1], params, true));
      } else if (!parsers[i]?.(q, params) && !isOptional(keys[i])) {
        return false;
      }
    }

    return true;
  };
}
