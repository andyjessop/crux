import type { API } from "@crux/query";
import type { PostUser, PutUser, User, UsersAPI } from "../../api/users-api.service";
import { deleteUser, mergeUser, toData } from "./transformations";

export type UsersData = ReturnType<typeof createUsersDataService>;

export function createUsersDataService(createResource: API['createResource'], users: UsersAPI) {
  const resource = createResource('users', {
    query: () => {
      return users
      .getAll()
      .then(toData)
      .catch(e => { throw e as { message: string } });
    },
    mutations: {
      create: {
        query: (user: PostUser) => users.post(user)
      },
      delete: {
        query: (id: number) => users.delete(id),
        optimistic: (id: number) => (data: User[] | null) => deleteUser(data, id),
      },
      update: {
        query: (user: PutUser) => (data: User[] | null) => users
          .put(user)
          .then(res => res.data ? mergeUser(data, res.data) : data),
        optimistic: (user: PutUser) => (data: User[] | null) => mergeUser(data, user),
        options: {
          refetchOnSuccess: false,
        }
      },
    },
    options: {
      lazy: true,
      keepUnusedDataFor: 60,
      pollingInterval: 360,
    },
  });
  
  return resource.subscribe;
}