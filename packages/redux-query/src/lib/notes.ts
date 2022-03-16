// import { MiddlewareAPI } from 'redux';

// import { User } from '../../components/navbar/subcomponents/userMenu/style';

// interface State<D> {
//   data: D | null;
//   error: Error | null;
//   loading: boolean;
// }

// interface Error<D = any> {
//   code: string;
//   data: D;
// }

// type GetActions<S, D, E> = {
//   fulfilled: (state: S, action: D) => S;
//   pending: (state: S) => S;
//   rejected: (state: S, payload: E) => S;
// };

// export const createGetActions = <Data>(): GetActions<State<Data>, Data, Error> => {
//   return {
//     fulfilled: (state: State<Data>, payload: Data): State<Data> => ({
//       ...state,
//       data: payload,
//       error: null,
//       loading: false,
//     }),

//     pending: (state: State<Data>): State<Data> => ({
//       ...state,
//       loading: true,
//     }),

//     rejected: (state: State<Data>, payload: Error): State<Data> => ({
//       ...state,
//       error: payload,
//       loading: false,
//     }),
//   };
// };

// type PostActions<S, D, E> = {
//   fulfilled: (state: S) => S;
//   pending: (state: S, payload: D) => S;
//   rejected: (state: S, payload: E) => S;
// };

// export const createPostActions = <Data>(): PostActions<State<Data>, Data, Error> => {
//   let pendingData: Data;

//   return {
//     fulfilled: (state: State<Data>): State<Data> => ({
//       ...state,
//       data: pendingData,
//       error: null,
//       loading: false,
//     }),

//     pending: (state: State<Data>, payload: Data): State<Data> => {
//       pendingData = payload;

//       return {
//         ...state,
//         loading: true,
//       };
//     },

//     rejected: (state: State<Data>, payload: Error): State<Data> => ({
//       ...state,
//       error: payload,
//       loading: false,
//     }),
//   };
// };

// export const createPostActionsOptimistic = <Data>(): PostActions<State<Data>, Data, Error> => {
//   let oldData: Data | null;

//   return {
//     fulfilled: (state: State<Data>): State<Data> => ({
//       ...state,
//       error: null,
//       loading: false,
//     }),

//     pending: (state: State<Data>, payload: Data): State<Data> => {
//       oldData = state.data;

//       return {
//         ...state,
//         data: payload,
//         loading: true,
//       };
//     },

//     rejected: (state: State<Data>, payload: Error): State<Data> => ({
//       ...state,
//       data: oldData,
//       error: payload,
//       loading: false,
//     }),
//   };
// };

// type DeleteActions<S, D, E> = {
//   fulfilled: (state: S) => S;
//   pending: (state: S, payload: D) => S;
//   rejected: (state: S, payload: E) => S;
// };

// export const createDeleteActions = <Data>(): DeleteActions<State<Data>, Data, Error> => {
//   let pendingData: Data;

//   return {
//     fulfilled: (state: State<Data>): State<Data> => ({
//       ...state,
//       data: pendingData,
//       error: null,
//       loading: false,
//     }),

//     pending: (state: State<Data>, payload: Data): State<Data> => {
//       pendingData = payload;

//       return {
//         ...state,
//         loading: true,
//       };
//     },

//     rejected: (state: State<Data>, payload: Error): State<Data> => ({
//       ...state,
//       error: payload,
//       loading: false,
//     }),
//   };
// };

// interface User {
//   name: string;
//   uuid: string;
// }

// const logger = {
//   log: <D>({ data, type }: { data: D; type: 'error' | 'debug' }) => {},
// };

// const options = {
//   baseURL: '/api',
//   headers: {
//     'content-type': 'application/json',
//   },
//   keepUnusedDataFor: 60, // 60 seconds (better name?)
// };

// const config = {
//   // Generates action: createUser({ name: 'newName' });
//   createUser: {
//     method: 'POST',
//     options: {
//       headers: {
//         'content-type': 'application/json',
//       },
//       onSuccess: () => ({
//         invalidateTags: ['users'],
//       }),
//     },
//     url: 'api/user',
//   },

//   // Generates action: deleteUser({ id: 1 });
//   deleteUser: {
//     method: 'DELETE',
//     options: {
//       onSuccess: () => ({
//         invalidateTags: ['users'],
//       }),
//     },
//     url: '/api/user/:id',
//   },

//   // Generates action: getUser({ id: 1 });
//   getUser: {
//     method: 'GET',
//     options: {
//       onError: (redux: MiddlewareAPI) => (state: State<User>, payload: Error) => {
//         logger.log({ data: payload, type: 'error' });
//       },
//       onLoading: (state: State<User>) => {},
//       onSuccess: (state: State<User>, payload: User) => ({
//         tags: [state.data?.uuid],
//       }),
//       transformResponse: (response: { data: User }) => response.data,
//     },
//     url: '/api/user/:id',
//   },

//   getUsers: {
//     method: 'GET',
//     options: {
//       onSuccess: (redux: MiddlewareAPI) => {
//         // Streaming updates: https://redux-toolkit.js.org/rtk-query/usage/streaming-updates
//         const ws = new WebSocket('ws://localhost:8080');

//         const listener = (event: MessageEvent) => {
//           const data = JSON.parse(event.data);

//           // if is not users message, return

//           redux.dispatch(updateUsers(data)); // updateUsers created separately
//         };

//         ws.addEventListener('message', listener);

//         return {
//           onCacheRemoved: () => {
//             ws.removeEventListener('message', listener);
//             ws.close();
//           },
//           tags: ['users'],
//         };
//       },
//     },
//     url: 'api/user',
//   },

//   // Generates action: updateUser({ id: 1 }, { name: 'newName' });
//   updateUser: {
//     method: 'PUT',
//     options: {
//       onSuccess: (state: State<User>, payload: User) => ({
//         invalidateTags: [payload.uuid], // only invalidate the user with uuid
//       }),
//       optimistic: true, // optimistic updates (https://redux-toolkit.js.org/rtk-query/usage/manual-cache-updates)
//     },
//     url: 'api/user/:id',
//   },
// };

// // interface State {
// //   data: User | null;
// //   error: Error | null;
// //   loading: boolean;
// // }

// // import { createAPI, createResource } from '@crux/redux-query';

// const { api, reducer, register, unregister } = createAPI(options);

// const userResource = createResource<User, Error>(config, options);
// const usersResource = createResource<User[], Error>(config, options);

// register('user', userResource); // code-splitting
// register('users', usersResource);
// unregister('user');

// const { dispose, fetch } = api.user
//   .withOptions({
//     lazy: true, // conditional fetching (https://redux-toolkit.js.org/rtk-query/usage/conditional-fetching)
//     pollingInterval: 360,
//   })
//   .getUser({ id: 1 });

// const { dispose, fetch } = api.user
//   .withOptions({
//     onSuccess: () => {},
//   })
//   .getUser({ id: 1 });

// fetch(); // force fetch
// dispose();

// const { dispose: dispose1, fetch } = api.user.getUsers(); // cache count: 1
// const { dispose: dispose2, fetch } = api.user.getUsers(); // cache count: 2

// dispose1(); // cache count: 1
// dispose2(); // cache count: 0. Cache removed after x seconds

// const { dispose, fetch } = api.user.get({ id: 1 });
// const { dispose, fetch } = api.user.post({ name: 'name' });
// const { dispose, fetch } = api.user.put({ id: 1 }, { name: 'newName' });

// // https://redux-toolkit.js.org/rtk-query/usage/manual-cache-updates
// // RTK Query has an `updateQueryData` function. Instead it should be done by just creating
// // a standard action for this specific purpose, and firing it with dispatch.

// produces actions
// slice/fulfilled
// slice/pending
// slice/rejected
// slice/other/fulfilled
// slice/other/pending
// slice/other/rejected

// interface TestState {
//   booleanValue: boolean;
//   stringValue: string;
//   undefinedValue: boolean;
// }

// const { actions: testActions, reducer: testReducer } = createSlice({
//   setBooleanValue: (state: TestState, payload: boolean) => ({
//     ...state,
//     booleanValue: payload
//   }),
//   setStringValue: (state: TestState, payload: string) => ({
//     ...state,
//     stringValue: payload
//   }),
//   setUndefinedValue: (state: TestState) => ({
//     ...state,
//     undefinedValue: true
//   }),
// }, {
//   initialState: {
//     booleanValue: false,
//     stringValue: '',
//   },
//   name: 'test',
// });

// type Get<D, E> = {
//   query: (...args: any[]) => Promise<unknown>,
//   optimistic?: boolean,
//   onSuccess: (response: unknown) => D,
//   onError: (response: unknown) => E,
//   url: string,
// };

// type Delete<E> = {
//   query: (...args: any[]) => Promise<unknown>,
//   optimistic?: boolean,
//   onError: (response: unknown) => E,
//   url: string,
// };

// function createDataSlice<Data, Error>({
//   base,
//   delete,
//   get,
// }: {
//   base: string;
//   delete?: Delete<Error>;
//   get?: Get<Data, Error>;
// }) {
//   type State = {
//     data: Data | null,
//     error: Error | null,
//     loading: boolean,
//   }

//   const initialState: State = {
//     data: null,
//     error: null,
//     loading: false,
//   }

//   const slice = createSlice({
//     [`${base}/pending`]: (state: State) => ({
//       ...state,
//       loading: true,
//     }),

//     [`${base}/fulfilled`]: (state: State, payload: Data) => ({
//       ...state,
//       data: onSuccess?.(payload) ?? payload,
//       error: null,
//       loading: false,
//     }),

//     [`${base}/rejected`]: (state: State, payload: Error) => ({
//       ...state,
//       data: null,
//       error: onError?.(payload) ?? payload,
//       loading: false,
//     }),
//   }, { initialState });

//   return slice.actions[`${base}/pending`];

//   function asyncThunkMiddleware(api: MiddlewareAPI) {
//     return function withStore(store: Store) {
//       return function withAction(action: AnyAction) {
  
//       }
//     }
//   }
// }