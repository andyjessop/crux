## `@crux/redux-registry`

`@crux/redux-registry` is a tool to dynamically add and remove reducers and middleware. It was conceived to aid code-splitting.

It's very small, weighing-in <600B minified and gzipped.

### Usage

First create the registries and add them to your store:


```ts
// ./store.ts
import { configureStore } from '@reduxjs/toolkit';
import { middlewareRegistry, reducerRegistry } from '@crux/redux-registry';

const mRegistry = middlewareRegistry();
const rRegistry = reducerRegistry();

const store = configureStore({
  reducer: rRegistry.reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(mRegistry.middleware),
});

export const addMiddleware = mRegistry.add;
export const addReducer = rRegistry.add;
```

Then in your application code:

```ts
import { addMiddleware, addReducer } from './store';

/**
 * Example reducer that adds a user to a `data` array in the store.
 */
const usersReducer = (state, action) => {
  switch (action.type) {
    case 'addUser':
      return {
        ...state,
        data: [...state.data, action.payload]
      };
  }
}

const removeUsersReducer = addReducer('users', usersReducer);

/**
 * Example middleware to log when a user is added.
 */ 
const loggerMiddleware = () => next => action => {
  if (action.type === 'addUser') {
    console.log(action);
  }
}

const removeLoggerMiddleware = addMiddleware(loggerMiddleware);
```

Both `addReducer` and `addMiddleware` return a function that allows you to remove the reducer or middleware you added. So to clean up:

```ts
removeUsersReducer();
removeLoggerMiddleware();
```