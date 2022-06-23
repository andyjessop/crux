import { createAPI } from '@crux/redux-query';

export const { middleware, reducer, reducerId, createResource } = createAPI('api');

// const users = (await api.resource('users'));

// const { unsubscribe, fetch, mutations, select } = users.subscribe(123);

// await fetch();

// expect(select(store.getState())).toEqual({
//   data: [
//     { id: '1', name: 'name1' },
//     { id: '2', name: 'name2' },
//   ],
//   error: null,
//   loading: false,
//   updating: false,
// });

// await mutations.put({ id: '1', name: 'newName' });
// await mutations.put({ name: 'newName' });

// expect(select(store.getState())).toEqual({
//   data: [
//     { id: '1', name: 'newName' },
//     { id: '2', name: 'name2' },
//   ],
//   error: null,
//   loading: false,
//   updating: false,
// });

// unsubscribe();