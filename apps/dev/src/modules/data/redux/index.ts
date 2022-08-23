import type { API } from "@crux/query";

export function createDataRedux(data: API) {
  const { reducer, middleware } = data;

  debugger;

  return {
    middleware, reducer,
  };
}