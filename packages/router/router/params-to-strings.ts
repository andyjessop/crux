import type { Router } from './types';

export function paramsToStrings(dict: Router.RouteParams) {
  for (let key in dict) {
    if (dict.hasOwnProperty(key)) {
      if (Array.isArray(dict[key])) {
        for (let i = 0; i < (<string[]>dict[key])!.length; i++) {
          (<string[]>dict[key])![i] = (<string[]>dict[key])![i].toString();
        }
      } else {
        dict[key] = dict[key] ? dict[key]!.toString() : null;
      }
    }
  }

  return dict;
}
