
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
        options: {
          optimisticUpdate: (user: User) => (data: User[] | null) => deleteUser(data, user),
        }
      },
      update: {
        query: (user: PutUser) => api.user.put(user),
        options: {
          optimisticUpdate: (user: PutUser) => (data: User[] | null) => mergeUser(data, user),
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