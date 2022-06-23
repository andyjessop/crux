import { createUseResource, mocks } from '@crux/redux-query';
import { createResource } from '../api';

const dataAPI = mocks.createDataAPI();

export const users = createResource('users', mocks.createUserConfig(dataAPI));
export const comments = createResource('comments', mocks.createCommentConfig(dataAPI));

users.onSuccess('delete', ({ state }, data) => {
  // if (data.find())
});

export const useUsers = createUseResource(users);