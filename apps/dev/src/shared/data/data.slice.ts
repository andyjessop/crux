import type { API } from "@crux/query";

export function createDataSlice(data: API) {
  const { reducer, middleware } = data;

  return {
    middleware, reducer,
  };
}