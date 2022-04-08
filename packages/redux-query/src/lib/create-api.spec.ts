
import { configureStore } from '@reduxjs/toolkit';
import { resources } from '../lib/test/resources';
import { createAPI } from './create-api';


describe('createAPI', () => {
  it('should create API', async () => {
    const api = createAPI(resources);
    const { middleware, reducer, reducerId } = api;

    const store = configureStore({
      reducer: {
        [reducerId]: reducer,
      },
      middleware: [middleware],
    });

    const users = (await api.resource('users'));

    const { unsubscribe, fetch, mutations, select } = users.subscribe(123);

    await fetch();

    expect(select(store.getState())).toEqual({
      data: [
        { id: '1', name: 'name1' },
        { id: '2', name: 'name2' },
      ],
      error: null,
      loading: false,
      updating: false,
    });

    await mutations.put({ id: '1', name: 'newName' });
    await mutations.put({ name: 'newName' });

    expect(select(store.getState())).toEqual({
      data: [
        { id: '1', name: 'newName' },
        { id: '2', name: 'name2' },
      ],
      error: null,
      loading: false,
      updating: false,
    });

    unsubscribe();
  });

  it('should update state manually', async () => {
    const api = createAPI(resources);
    const { middleware, reducer, reducerId } = api;

    const store = configureStore({
      reducer: {
        [reducerId]: reducer,
      },
      middleware: [middleware],
    });

    const users = (await api.resource('users'));

    const { unsubscribe, manualUpdate, select } = users.subscribe();

    manualUpdate({
      data: [
        { id: '1', name: 'name' },
      ],
      error: null,
      loading: true,
      updating: true,
    });

    expect(select(store.getState())).toEqual({
      data: [
        { id: '1', name: 'newName' },
        { id: '2', name: 'name2' },
      ],
      error: null,
      loading: false,
      updating: false,
    });

    unsubscribe();
  });
})