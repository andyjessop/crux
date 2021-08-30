# `@crux/store`

`@crux/store` is an uncomplicated library with a succinct API that allows you to make and observe changes to a state object.

When subscribing, you provide a selector, which derives an arbitrary value from your state object, and a callback, which is called with the value returned from the selector.

Updating the state is really simple too. Just pass your new partial state to `update(partialState: Partial<State>)` and all affected callbacks will fire.

## Installation

```bash
npm install --save @crux/store
```

## Usage

### Initialising the store

```ts
import { createStore } from '@crux/store';

interface State {
  users: User[];
}

interface User {
  username: string;
}

const store = createStore<State>({ users: [] });
```

### Adding subscriptions

```ts
const unsubscribe = store.subscribe(getUsers, usersCallback);

/**
 * Selector to get the array of users from the state 
 */
function getUsers(state: State): User[] {
  return state.users;
}

/**
 * Callback to fire when the state.users array is updated 
 */
function usersCallback(users: User[]) {
  console.log(users);
}
```

### Updating the state

```ts
store.update({ users: ['alice', 'bob', 'charlie'] });

// Console output:
// ['alice', 'bob', 'charlie']
```

You can also update a nested state by providing a target path as the second parameter.

```ts
interface State {
  topLevelState: {
    val: boolean,
    nestedState: {
      nestedVal: boolean,
    }
  }
}

store.update({ val: true }, 'topLevelState');
store.update({ nestedVal: true }, 'topLevelState.nestedState');
```

### Unsubscribing

```ts
const unsubscribe = store.subscribe(getUsers, usersCallback);

unsubscribe();

store.update({ users: ['alice', 'bob', 'charlie'] });

// No console output
```

### Pausing/resuming reactivity

`@crux/store` provides a way to batch updates by pausing and resuming the store. Any callbacks fired during the paused state are queued, and fired synchronously when the store is resumed.

```ts
store.pause();

store.update({ users: ['alice', 'bob', 'charlie'] });

// No console output

store.resume();

// Console output:
// ['alice', 'bob', 'charlie']
```
