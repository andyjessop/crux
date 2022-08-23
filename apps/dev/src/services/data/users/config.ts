import type { User } from "@runestone/interfaces";
import type { PostUser, PutUser, Users } from "../../api/users";
import { deleteUser, mergeUser, toData } from "./transformations";

export function config(api: ReturnType<Users>) {
  return {
    query: () => api
      .getAll()
      .then(toData)
      .catch(e => { throw e as { message: string } }),
    mutations: {
      create: {
        query: (user: PostUser) => api.post(user)
      },
      delete: {
        query: (id: number) => api.delete(id),
        optimistic: (id: number) => (data: User[] | null) => deleteUser(data, id),
      },
      update: {
        query: (user: PutUser) => (data: User[] | null) => api
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
  }
}