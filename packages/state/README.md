# Crux State

`crux-state` is:

- very simple state management for the browser,
- tiny, weighing in at < 600B minfied (< 400B gzipped),
- immutable, ensuring predictable state updates throughout your app.

## Installation

```bash
npm install crux-state --save
```

## Usage

```ts
import { createStore } from 'crux-state';

/**
 * Create the initial state.
 */
const initial = {
  users: {
    active: [1, 2, 3],
  },
};

/**
 * Create your store from the initial state.
 */
const store = createStore(initial);

/**
 * Create an observer for the store.
 */
const users = store.observe(store.state.users, log);

/**
 * Make a change to the observed object, and watch it log to the console.
 */
users.active = [...users.active, 4];

/**
 * Log the change event to the console.
 */
function log(key, value) {
  console.log(key, value);
}
```

### Immutability

Notice in the example above that the `users.active` array is updated immutably, by creating a new array reference with the spread operator. This is essential for `crux-state` to know that the contents of the object have changed.

`crux` state works by creating a Proxy for the object, but unlike some other more permissive libraries, it doesn't do this recursively. Therefore it notifies observers only when a top level propery on the observed object has changed, hence why you need to use the spread operator (or `Object.assign({}, obj)`). While this is not a pretty as just mutating the data directly, it does mean that the library stays very fast, with a very small memory footprint.

Happy observing!
