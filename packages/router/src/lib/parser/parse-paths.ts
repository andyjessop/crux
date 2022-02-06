import { RouteParams } from '../router';
import { parseSegment } from './parse-segment';

/**
 * Parse a path, returning a curried function.
 */
export function parsePaths(targets: string[]) {
  const parsers = targets.map(parseSegment);

  return function curriedParsePaths(path: string[], params: RouteParams) {
    if (targets.length !== path.length) {
      return false;
    }

    for (let i = 0; i < targets.length; i++) {
      if (!parsers[i](path[i], params)) {
        return false;
      }
    }

    return true;
  };
}
