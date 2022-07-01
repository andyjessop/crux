# `@crux/query`

An alternative to Redux Toolkit with a simplified API.

## Motivation

The folks over at RTK have done an amazing job at reducing boilerplate in Redux applications, and have gone down the route of being very opinionated about how you write your code. There is no poblem with this at all, but for those who want similar functionality without being tied to `immer` or to the `builder` syntax for generating their config, `@crux/query` provides a solution that is closer to the metal.

## Installation

```bash
npm install --save @crux/query
```

## `createSlice`

```ts
import { createSlice } from '@crux/query';

// counter/slice.ts
interface State {
  count: number;
}

const initial: State = { count: 0 };

export const { actions, getType, reducer } = createSlice({
  add: (state: State, payload: number) => ({
    ...state,
    count: state.count + payload
  }),
  subtract: (state: State, payload: number) => ({
    ...state,
    count: state.count - payload
  }),
}, { initialState: initial, name: 'counter' });
```

You can then add your reducer as normal:

```ts
import { reducer } from 'counter/slice.ts';

configureStore({
  reducer: {
    counter: reducer
  }
});
```

And dispatch your actions as normal:

```ts
import { actions } from 'counter/slice.ts';

dispatch(actions.add(5)); // dispatches { type: 'counter/add', payload: 5 }
```

If you need access to the action type (for sagas, for example), you can use `getType`:

```ts
import { getType } from 'counter/slice.ts';

// ...in saga
yield takeLatest(getType('add'), cb);
```

Note that the string passed to `getType` is guarded by TS, so you will get an error if it's not been provided as a key in your slice config.


## `createAPI`

`createAPI` is used for when you want to hook up your existing HTTP API with Redux. `@crux/query` will intelligently manage your Redux store so that you can subscribe to endpoints _declaratively_, not worrying about when to fetch, how to update your cache, etc. Using `createAPI` you can drastically simplify the most common operations (and some of the more obscure ones too).

### Initialising

The general concept is that you create your `api` then use that to create `resource`s to which you can subscribe.

```ts
import { createAPI } from '@crux/query`;

const api = createAPI();
```

Let's look at a basic config for a `users` resource. What we want to do here is to create a data slice that looks like this:

```ts
users: {
  data: [],
  loading: false,
  error: null,
  updating: false,
}
```

The config for our `users` resource looks like this:

```ts
import { data } from './data-service';

export const userResource = {
  query: (options?: { since: number, until: number }) => data.user
    .getAll(options)
    // Our endpoint returns the users as an object with `result` being the array of users
    // so here we transform it to the `data: []` array we need in the redux slice.
    .then(transformToData)
    .catch(e => { throw e }),
  options: {
    lazy: true
  }
}

function transformToData(response) {
  return response.result;
}
```

### Subscribing

Now create the resource and subscribe to it:

```ts
const users = api.createResource(userResource);

const { refetch, unsubscribe } = users.subscribe();

// We set the `lazy: true` option, so it didn't fetch straight away, so let's call that now in order
// to populate the store with data
refetch();
```

So we've created a subscription to the users resource, and we've initated a `refetch`. When that happened, `@crux/query` kicked off a series of updates to the store. First of all, it fired off a `pending` action, specifically a `users/get/pending` action, which updated he slice to look like this:

```ts
users: {
  data: null,
  loading: true,
  error: null,
  updating: true,
}
```

Notice how both `loading` and `updating` are `true`. `loading` is for the initial load, whereas `updating` is for the current and any subsequent update.

The `data` and `error` values are still `null`, because we haven't received any data yet.

When the `data.users.getAll()` call resolves, `@crux/query` will fire off a `users/get/fulfilled` action, and will update the store accordingly:

```ts
users: {
  data: [{ id: 1, username: 'alice' }, { id: 2, username: 'bob' }],
  loading: false,
  error: null,
  updating: false,
}
```

### Multiple subscribers

Where `@crux/query` really comes into its own is when managing multiple subscribers. Let's say we have an extra subscriber in a different module:

```ts
const { refetch } = users.subscribe();
refetch();
```

There are a few things we want to happen:

1. We don't want to immediately fire of another http call if the components are mounted at similar times.
2. We want to ensure that we keep one subscription even if the other is disposed.

`@crux/query` keeps a record of the number of subscribers to a given subscription (note that `users.subscribe()` is a different subscription to `users.subscribe({ since: 1700 })`), and when that number of subscribers reaches zero, it starts a self-destruct timer for that slice. After 60 seconds (the default, configurable in the `options`), the data is cleared and the slice removed. If another subscription gets setup in that time, the self-descruct is cancelled.

The self-destruct time can be configured in the resource options like so:

```ts
export const userResource = {
  query: ...
  options: {
    keepUnusedDataFor: 120, // 2 minute self-destruct timeout
  }
}
```

### Polling Interval

`@crux/query` can be configured to simulate real-time data by polling an endpoint at a specified interval. This is useful if you want to avoid the added complexity of setting up WebSockets, or if your server doesn't support them. It's the equivalent of calling `refetch()` at the specified interval.

```ts
export const userResource = {
  query: ...
  options: {
    pollingInterval: 10, // refetch every 10 seconds
  }
}
```

### Mutations

We've covered querying data from your API, but how to you mutate data? Let's look at how to add `create`, `delete` and `update` to your resource config:

```ts
const resource = {
  query: () => api.user
    .getAll()
    .then(toData)
    .catch(e => { throw e as { message: string } }),
  mutations: {
    create: {
      query: (user: PostUser) => api.user.post(user)
    },
    delete: {
      query: (id: number) => api.user
        .delete(id)
        .then(toUndefined), 
      options: {
        optimisticTransform: (user: User) => (data: User[] | null) => deleteUser(data, user),
      }
    },
    update: {
      query: (user: PutUser) => (data: User[] | null) => api.user
        .put(user)
        .then(toUndefined),
      options: {
        optimisticTransform: (user: PutUser) => (data: User[] | null) => updateUser(data, user),
      }
    },
  },
};

export function toUndefined() {
  return undefined;
}

/**
 * Delete a user from an array of users 
 */
export function deleteUser(data: User[] | null, user: User) {
  if (data === null) {
    return data;
  }

  return data.filter(u => user.id !== u.id);
}

/**
 * Update a user in an array of users.
 **/
export function updateUser(data: User[] | null, user: PutUser) {
  if (data === null) {
    return data;
  }

  const ndx = data?.findIndex(u => u.id === user.id);

  if (ndx === -1) {
    return data;
  }

  data[ndx] = {
    ...data[ndx],
    ...user
  };

  return data;
}
```

**See below ([Updating state optimistically](#updating-state-optimistically)) for why we're returning `undefined` in the examples above**

Each of the mutations above has a `query` property, where we call our API, and some optional `options` (of course they're optional, they're options...).

Notice that `delete` and `update` define the `optimisticTransform` option. Let's look at that now.

### Updating State Optimistically

For many API operations, you generally know it's going to succeed. In which case, to provide the best possible user experience you might want the UI to update immediately. In order to do this, for any given mutation, `query` allows you to specify an `optimisticTransform` - this is a way to transform the input to your mutation into a new state. 

Let's focus on the config `update` mutation above:

```ts
update: {
  query: (user: PutUser) => (data: User[] | null) => api.user
    .put(user)
    .then(toUndefined),
  options: {
    optimisticTransform: (user: PutUser) => (data: User[] | null) => updateUser(data, user),
  }
},
```

The first thing to note here is that `@crux/query` allows you to return a curried function for your query, so rather than having the pattern:

```ts
(...args: any[]) => Promise<User[]> 
```

You can access the current `data` value of the state:

```ts
(...args: any[]) => (data: State['data']) => Promise<User[]> 
```

In this case, the state is our `User[] | null` type. What this allows us to do is to return an updated `data` value for our state without waiting for the `update` `Promise` to resolve.

Note that the actual query returns `undefined` in this case. When `@crux/query` receives `undefined` as the response, **it will not update the `data` value in state**, so you won't see an unnecessary re-render in your UI.