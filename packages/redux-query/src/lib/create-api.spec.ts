
import { configureStore } from '@reduxjs/toolkit';
import { createAPI } from './create-api';
import { createDataAPI, createUserConfig } from './test';
import { Resource } from './types';

jest.useFakeTimers();

describe('createAPI', () => {
  let api = createAPI();
  let dataAPI = createDataAPI();
  let createResource = api.createResource;
  const { middleware, reducer, reducerId } = api;

  let store = configureStore({
    reducer: { [reducerId]: reducer },
    middleware: [middleware],
  });

  beforeEach(() => {
    api = createAPI();
    dataAPI = createDataAPI();
    createResource = api.createResource;
    const { middleware, reducer, reducerId } = api;

    store = configureStore({
      reducer: { [reducerId]: reducer },
      middleware: [middleware],
    });
  });

  it('should create resource', async () => {
    const resource = createResource('users', createUserConfig(dataAPI));

    const { mutations } = resource.subscribe();

    await mutations.update({ id: 1, name: 'newName' });
  })

  it('should fetch users', async () => {
    const users = createResource('users', createUserConfig(dataAPI));

    const { unsubscribe, refetch, select } = users.subscribe();

    await refetch();

    expect(select(store.getState())).toEqual({
      data: [
        { id: '1', name: 'name1' },
        { id: '2', name: 'name2' },
      ],
      error: null,
      loading: false,
      updating: false,
    });

    unsubscribe();
  });

  it('should mutate user', async () => {
    const users = createResource('users', createUserConfig(dataAPI));

    const { unsubscribe, mutations, select } = users.subscribe();

    await mutations.update({ id: 1, name: 'newName' });

    unsubscribe();
  });

  it('should delete user', async () => {
    const resource = createResource('users', createUserConfig(dataAPI));

    const { unsubscribe, mutations: users, select } = resource.subscribe();

    await users.delete(1);

    unsubscribe();
  });

  it('should update state manually', async () => {
    const users = createResource('users', createUserConfig(dataAPI));

    const { unsubscribe, manualUpdate, select } = users.subscribe();

    manualUpdate([
      { id: 1, name: 'name' },
    ]);

    expect(select(store.getState())).toEqual({
      data: [
        { id: '1', name: 'name' },
      ],
      error: null,
      loading: false,
      updating: false,
    });

    unsubscribe();
  });

  // it('should invalidate cache', () => {
  //   const user = createResource('user', resources.user).subscribe();
  //   const posts = createResource('posts', resources.posts).subscribe();

  //   posts.onFetch('get', refetchPosts);

  //   function refetchPosts(state, response) {
  //     if (response.id === user.getState().data.id) {
  //       posts.refetch();
  //     }
  //   }
  // });

  it('should listen to events', async (done) => {
    const resource = createResource('users', createUserConfig(dataAPI));

    resource.onFetch('get', ({ state }, ...params) => { 
      expect(state).toEqual({
        data: null,
        error: null,
        loading: true,
        updating: false,
      });

      expect(params).toEqual([]);

      done();
     });

     const users = resource.subscribe();

     await users.refetch();
    // users.onError('delete', () => { /**/ });
    // users.onSuccess('create', () => { /**/ });

    // users.unsubscribe();
  })
})