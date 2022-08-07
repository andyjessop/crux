
import { createDataAPI, PostUser, PutUser, User } from "../../api";
import { deleteUser, mergeUser, toData } from "./transformations";

export function createUserConfig(api: ReturnType<typeof createDataAPI>) {
  return {
    query: () => api.user
      .getAll()
      .then(toData)
      .catch(e => { throw e as { message: string } }),
    mutations: {
      create: {
        query: (user: PostUser) => api.user.post(user)
      },
      delete: {
        query: (id: number) => api.user.delete(id),
        optimistic: (id: number) => (data: User[] | null) => deleteUser(data, id),
      },
      update: {
        query: (user: PutUser) => (data: User[] | null) => api.user
          .put(user)
          .then(res => mergeUser(data, res.data)),
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