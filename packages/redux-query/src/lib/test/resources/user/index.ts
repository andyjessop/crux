
import { Resource, State } from "../../../types";
import { api as userAPI } from "../../api/user";
import { Error, User } from "../../types/user";
import { mergeUser, postResponseToData, toData, toError, toNull, toUndefined } from "./transformations";

export const users = {
  api: () => userAPI
    .getAll()
    .then(toData)
    .catch(toError),
  mutations: {
    delete: {
      api: (id: string) => userAPI
        .delete(id)
        .then(toNull) // return value replaces `data` in state
        .catch(toError),
      optimisticUpdate: (/* id: string */) => null,
      type: 'delete'
    },
    post: {
      api: (user: Omit<User, 'id'>) => (state: State<User[], Error>) => userAPI
        .post(user)
        .then(res => postResponseToData(state, res)) // updates without refetching
        .catch(toError),
      type: 'create'
    },
    put: {
      api: (user: Partial<User> & Pick<User, 'id'>) => userAPI
        .put(user)
        .then(toUndefined) // doesn't update the state. Forces refetch of 'get'
        .catch(toError),
      // Optimistic update can use same signature as api call: (...params) => state => data
      optimisticUpdate: (user: Partial<User> & Pick<User, 'id'>) => (state: State<User[], Error>) => mergeUser(state, user),
      type: 'update'
    },
  },
  name: 'get',
  options: {
    clearDataOnError: true, // default false
    lazy: true,  // conditional fetching (https://redux-toolkit.js.org/rtk-query/usage/conditional-fetching)
    keepUnusedDataFor: 60,
    pollingInterval: 360,
  },
} as Resource<User[], Error>;