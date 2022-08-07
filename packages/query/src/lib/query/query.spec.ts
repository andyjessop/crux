
import { configureStore } from '@reduxjs/toolkit';
import { query } from './query';
import { createDataAPI, createUserConfig } from '../test';

jest.useFakeTimers();

describe('createAPI', () => {
  let api = query('api');
  let dataAPI = createDataAPI();
  let createResource = api.createResource;
  const { middleware, reducer, reducerId } = api;

  let store = configureStore({
    reducer: { [reducerId]: reducer },
    middleware: [middleware],
  });

  beforeEach(() => {
    api = query('api');
    dataAPI = createDataAPI();
    createResource = api.createResource;
    const { middleware, reducer, reducerId } = api;

    store = configureStore({
      reducer: { [reducerId]: reducer },
      middleware: [middleware],
    });
  });

  it('should fetch users', async () => {
    const users = createResource('users', createUserConfig(dataAPI));

    const { unsubscribe, refetch, select } = users.subscribe();

    await refetch();

    expect(select(store.getState())).toEqual({
      data: [
        { id: 1, name: 'name1' },
        { id: 2, name: 'name2' },
      ],
      error: null,
      loading: false,
      updating: false,
    });

    unsubscribe();
  });

  it('should mutate user', async () => {
    const resource = createResource('users', createUserConfig(dataAPI));

    const { refetch, select, unsubscribe, update } = resource.subscribe();

    await refetch();

    await update({ id: 1, name: 'newName' });

    expect(select(store.getState())).toEqual({
      data: [
        { id: 1, name: 'newName' },
        { id: 2, name: 'name2' },
      ],
      error: null,
      loading: false,
      updating: false,
    });

    unsubscribe();
  });

  it('should optimistically update', async () => {
    const config = createUserConfig(dataAPI);

    const resource = createResource('users', config);

    const { refetch, select, unsubscribe, update } = resource.subscribe();

    await refetch();

    // Not awaiting refetch
    const updatePromise = update({ id: 1, name: 'newName' });

    expect(select(store.getState())).toEqual({
      data: [
        { id: 1, name: 'newName' },
        { id: 2, name: 'name2' },
      ],
      error: null,
      loading: true, // query will refetch after optimistic update
      updating: true,
    });

    await updatePromise;

    expect(select(store.getState())).toEqual({
      data: [
        { id: 1, name: 'newName' },
        { id: 2, name: 'name2' },
      ],
      error: null,
      loading: false,
      updating: false,
    });

    unsubscribe();
  });

  it('should delete user', async () => {
    const resource = createResource('users', createUserConfig(dataAPI));

    const { unsubscribe, delete: deleteUser } = resource.subscribe();

    await deleteUser(1);

    unsubscribe();
  });

  // it('should listen to events', (done) => {
  //   const resource = createResource('users', createUserConfig(dataAPI));

  //   resource.onFetch('get', ({ state }, ...params) => { 
  //     expect(state).toEqual({
  //       data: null,
  //       error: null,
  //       loading: true,
  //       updating: false,
  //     });

  //     expect(params).toEqual([]);

  //     done();
  //    });

  //    const users = resource.subscribe();

  //    users.refetch();
  // })
})