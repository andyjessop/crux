import type { Router } from "src/lib/router";
import { createEventEmitter } from "src/lib/utils";

export interface State {
  route: { name: string, params: any } | null
}

export function createRouter(router: Router.API) {
  return {
    navigate,
  }

  function navigate(name: string, params?: any) {
    router.navigate(name, params);
  }
}