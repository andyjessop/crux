# `@crux/query`

An alternative to Redux Toolkit with a simplified API.

## Motivation

The folks over at RTK have done an amazing job at reducing boilerplate in Redux applications, and have gone down the route of being very opinionated about how you write your code. There is no poblem with this at all, but for those who want similar functionality without being tied to `immer` or to the `builder` syntax for generating their config, `@crux/query` provides a solution that is closer to the metal.

## Installation

```bash
npm install --save @crux/query
```

## `createSlice`

`createSlice` is a shorthand way of creating actions and reducers, with minimal boilerplate. There is no shorter-hand way of defining a slice than this.

```ts
import { createSlice } from '@crux/query';

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

The payload of the action is fully typed, taken from your payload definition in the `createSlice` config. If you need access to the action type (to use in a saga, for example), you can use `getType`:

```ts
import { getType } from 'counter/slice.ts';

// ...in saga
yield takeLatest(getType('add'), cb);
```

Note that the string passed to `getType` is guarded by TS, so you will get an error if it's not been provided as a key in your slice config.


## `query`

`query` is used for when you want to hook up your existing HTTP API with Redux. `@crux/query` will intelligently manage your Redux store so that you can subscribe to endpoints _declaratively_, not worrying about when to fetch, how to update your cache, etc. Using `query` you can drastically simplify the most common operations (and some of the more obscure ones too).

### Initialising

The general concept is that you create your `api` then use that to create `resource`s to which you can subscribe.

```ts
import { query } from '@crux/query`;

const api = query();
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

// The data is fetched lazily by default (set `options.lazy: false` if you want it to fetch immediately), so it didn't fetch immediately. Let's call that now in order to populate the store with data
refetch();
```

So we've created a subscription to the users resource, and we've initated a `refetch`. When that happened, `@crux/query` kicked off a series of updates to the store. First of all, updated the state to be in the loading state. This happens synchronously with the `refetch` call.

```ts
users: {
  data: null,
  loading: true,
  error: null,
  updating: false, // Not updating yet, because `data` is still `null`
}
```

The `data` and `error` values are still `null`, because we haven't received any data yet.

When the `data.users.getAll()` call resolves, `@crux/query` will update the state accordingly:

```ts
users: {
  data: [{ id: 1, username: 'alice' }, { id: 2, username: 'bob' }],
  loading: false,
  error: null,
  updating: false,
}
```

### Multiple subscribers

Where `@crux/query` really comes into its own is when managing multiple subscribers, or "de-duplicating" the query. Let's say we have an extra subscriber in a different module:

```ts
const { refetch } = users.subscribe();

refetch();
```

There are a few things we want to happen:

1. We don't want to immediately fire of another HTTP call if the components are mounted at similar times.
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
      query: (id: number) => api.user.delete(id),
      optimistic: (user: User) => (data: User[] | null) => deleteUser(data, user),
    },
    update: {
      query: (user: PutUser) => api.user.put(user),
      optimistic: (user: PutUser) => (data: User[] | null) => updateUser(data, user),
    },
  },
};

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

Notice that `delete` and `update` define an `optimistic` method. Let's look at that now.

### Updating State Optimistically

For many API operations, you can assume that it will succeed. In which case, to provide the best possible user experience you might want the UI to update immediately. In order to do this, for any given mutation, `query` allows you to specify an `optimistic` method - this is a way to transform the input to your mutation into a new state. 

Let's focus on the config `update` mutation above:

```ts
update: {
  query: (user: PutUser) => api.user.put(user)
  optimistic: (user: PutUser) => (data: User[] | null) => updateUser(data, user),
},
```

The first thing to note here is that `@crux/query` allows you to return a curried function for your query, so rather than defining just a standard API call:

```ts
(...args: any[]) => Promise<User[]> 
```

You can access the current `data` value of the state:

```ts
(...args: any[]) => (data: State['data']) => Promise<User[]> 
```

In this case, the state is our `User[] | null` type. What this allows us to do is to return an updated `data` value for our state without waiting for the `update` `Promise` to resolve.

By default, `@crux/query` will refetch your `GET` query after each mutation. This is the recommended way to keep your state correct. However, there is another option if you want to avoid the extra API call.

`@crux/query` allows you to specify a `refetchOnSuccess` flag in your mutation options. If this is set to `false`, `@crux/query` will instead look to update the state from the return value of the mutation query. For example, let's modify the `update` mutation above:

```ts
update: {
  query: (user: PutUser) => (data: User[] | null) => api.user
    .put(user)
    .then((response => updateUser(data, response.user))),
  optimistic: (user: PutUser) => (data: User[] | null) => updateUser(data, user),
  options: {
    refetchOnSuccess: false,
  }
},
```

Here we've modified the return value of the query so that it returns the new `data` value of the state, in a very similar way to how we defined the `optimistic` update. As we've also defined `refetchOnSuccess: false`, `@crux/query` will user this return value as the new `data` value and will not refetch the `GET` query.

