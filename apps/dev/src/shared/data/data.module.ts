import { query } from "@crux/query";
import type { UsersAPI } from "../api/users-api.service";
import { createUsersDataService } from "./users/users-data.service";

export function createDataModule(users: UsersAPI) {
  const { createResource, middleware, reducer } = query('data');

  return {
    middleware,
    reducer,
    services: {
      users: {
        factory: () => Promise.resolve(() => createUsersDataService(createResource, users)),
      }
    }
  };
}