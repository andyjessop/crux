
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

    const resource = await api.resource('users');

    const { unsubscribe, fetch, mutations } = resource['get']();

    await fetch();

    expect(store.getState()[reducerId].users).toEqual({
      data: [
        { id: '1', name: 'name1' },
        { id: '2', name: 'name2' },
      ],
      error: null,
      loading: false,
      updating: false,
    });

    await mutations.put({ id: '1', name: 'newName' });

    expect(store.getState()[reducerId].users).toEqual({
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