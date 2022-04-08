
import { OperationType, State } from "../../../types";
import { api as userAPI } from "../../api/user";
import { Err, User } from "../../types/user";
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
      type: OperationType.Delete
    },
    post: {
      api: (user: Omit<User, 'id'>) => (state: State<User[], Err>) => userAPI
        .post(user)
        .then(res => postResponseToData(state, res)) // updates without refetching
        .catch(toError),
      type: OperationType.Create
    },
    put: {
      api: (user: Partial<User> & Pick<User, 'id'>) => userAPI
        .put(user)
        .then(toUndefined) // doesn't update the state. Forces refetch of 'get'
        .catch(toError),
      // Optimistic update can use same signature as api call: (...params) => state => data
      optimisticUpdate: (user: Partial<User> & Pick<User, 'id'>) => (state: State<User[], Err>) => mergeUser(state, user),
      type: OperationType.Update
    },
  },
  options: {
    clearDataOnError: true, // default false
    lazy: true,  // conditional fetching (https://redux-toolkit.js.org/rtk-query/usage/conditional-fetching)
    keepUnusedDataFor: 60,
    pollingInterval: 360,
  },
};