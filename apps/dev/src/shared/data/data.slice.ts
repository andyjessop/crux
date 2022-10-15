import type { API as queryAPI } from "@crux/query";

export function dataSlice(data: queryAPI) {
  const { createResource, reducer, middleware } = data;

  return {
    api: { createResource },
    middleware,
    reducer,
  };
}