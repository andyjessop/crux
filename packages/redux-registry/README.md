## `@crux/redux-registry`

`@crux/redux-registry` is a tool to dynamically add and remove reducers and middleware. It was conceived to aid code-splitting.

It's very small, weighing-in <600B minified and gzipped.

### Usage

```ts
import { createStore } from 'redux';
import { middlewareRegistry, reducerRegistry } from '@crux/redux-registry';

// Middleware
const mRegistry = middlewareRegistry();

const store = createStore(
  reducer,
  applyMiddleware(
    // ...other app middleware,
    mRegistry.middleware
  )
);

mRegistry.add(middleware, order);
mRegistry.remove(middleware);

// Reducer
const rRegistry = reducerRegistry();
rRegistry.add(store, namespace, reducer);
rRegistry.remove(store, namespace);
```