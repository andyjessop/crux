## `@crux/redux-registry`

`@crux/redux-registry` is a tool to dynamically add and remove reducers and middleware. It was conceived to aid code-splitting.

It's very small, weighing-in <600B minified and gzipped.

### Usage

```ts
import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import { middlewareRegistry, reducerRegistry } from '@crux/redux-registry';

const mRegistry = middlewareRegistry();
const rRegistry = reducerRegistry();

export const addMiddleware = mRegistry.add;
export const addReducer = rRegistry.add;

const store = createStore(rRegistry.reducer, {}, applyMiddleware(...[mRegistry.middleware]));
```