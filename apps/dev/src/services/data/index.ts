import { query } from "@crux/query";

export function createDataService(id: string) {
  const { createResource, middleware, reducer, reducerId } = query(id);

  return {
    createResource, middleware, reducer, reducerId
  };
}