# redux-slice

## Installation

```bash
npm install --save @crux/redux-slice
```

## `createSlice`

`createSlice` is a shorthand way of creating actions, reducers, and side-effects with minimal boilerplate. Normally, Redux leaves the side-effects up to you, and it's often messy, with no clear official direction. `@crux/redux-slice` replaces the need for sagas, and ensures your code is succinct, easy to read, easy to test, and decoupled for maximum longevity.

The one downside to having all this functionality baked-in is that you have to define the parameters of your payloads separately. However, as you'll see, this is a small price to pay. Let's take a look at a simple example that covers all our needs (actions, reducers, and side-effects).

```ts
import { createSlice } from '@crux/redux-slice';

interface CounterState {
  count: number;
}

const initialState: CounterState = { count: 0 };

// This is where we define the parms for our actions
type CounterSlice = {
  add: number;
  subtract: number;
}

// Note we have to provide the `CounterSlice` so that crux can work out the API. It's an unfortunate limitation of
// TypeScript that we can't infer the type of `api` here. Hopefully future versions will allow this.
export const { actions, middleware, reducer } = createSlice<CounterSlice>()('counter', initialState, {
  add: (state, num) => merge(state, {
    count: state.count + num
  }),
  subtract: (state, num) => merge(state, {
    count: state.count - num
  }),
  randomAddOrSubtract: (state, num) => async ({ api }) => {
    const shouldAdd = Math.random() > 0.5;

    if (shouldAdd) {
      api.add(num);
    } else {
      api.subtract(num);
    }
  }
};
```

All types within the config are inferred from:

a) `initialState`, which determines the shape of the `state`, and

b) `CounterSlice`, which determines the shape of the `payload`

### Registering your slice

In order to register your slice, you need to add both the reducer and the middleware that are returned from `createSlice`:

```ts
import { middleware, reducer } from 'counter/slice.ts';

configureStore({
  middleware: [middleware],
  reducer: {
    counter: reducer
  }
});
```

### Dispatching actions

Now you can dispatch your actions as normal:

```ts
import { actions } from 'counter/slice.ts';

dispatch(actions.add(5)); // dispatches { type: 'counter/add', payload: 5 }
```

### Multiple parameters

You can provide multiple parameters to your actions like this:

```ts
type CounterSlice = {
  add: [number, number];
}

const { actions, reducer } = createSlice<CounterSlice>()('counter', initial, {
  add: (state, one, two) => ({
    ...state,
    count: state.count + one + two
  }),
});
```

The `actions.add(1, 2)` action creator is fully typed, e.g. these will error:

```ts
dispatch(actions.add(1));
dispatch(actions.add('str'));
dispatch(actions.add(1, 2, 3));
```

### Optional parameters

You can also have optional parameters like this:

```ts
type CounterSlice = {
  add: [number, number?];
}

// Or this
type CounterSlice = {
  add: [number, number | void];
}

const { actions, reducer } = createSlice<CounterSlice>()('counter', initial, {
  addOptional: (state, one, two) => ({
    ...state,
    count: state.count + one + (two ?? 0)
  }),
});

dispatch(actions.add(1)); // no error this time
dispatch(actions.add(1, 2)); // still works
```

### Action type

If you need access to the action type (to use in a saga, for example), you can use the `type` property on the action:

```ts
actions.add.type // `counter/add`
```

### The API

`createSlice` also returns a handy `api` object (which is what is provided in your async callback above), whereby `dispatch` is called for you. This is great for reducing imports and coupling around your app. You still need to add the reducer and middleware as previously, but once that's done, you can now call this from anywhere without calling `dispatch`:

```ts
import { api } from 'counter/slice.ts';

api.add(1, 2);

// Because this is just a reducer method, your store is now updated synchronously:
console.log(store.getState().counter.count); // 3
```

If you want to get the type of your API, you can do it like this:

```ts
import { ApiOf } from '@crux/redux-slice';

export type CounterAPI = ApiOf<CounterSlice>;
```

### Side-effects

`createSlice` has another trick up its sleeve. Redux has many solutions for side-effects, but most of them fall short in a number of areas. Either TypeScript support is not great, or it results in messy, hard-to-reason-about code, or the API is polarising.

`createSlice` offers a new way to manage side-effects, from within the slice definition. If you return a function instead of a new state object, `createSlice` will call it with an object that contains an `api`, the very same `api` as in the section above. It's fully-typed, and makes for extremely simple side-effect logic.

Let's look at a simple auth example:

```ts
export interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
}

type AuthSlice = {
  login: [string, boolean?];
  loginFailure: void;
  loginSuccess: User;
  logout: void;
  logoutSuccess: void;
}

export type AuthApi = ApiOf<AuthSlice>;

export function createAuthSlice(name: string, auth: AuthHttp) {
  return createSlice<AuthSlice>()(name, initialState, {
    login: (state, email, remember = false) => async ({ api }) => {
      const user = await auth.login(email, remember);
  
      if (user) {
        api.loginSuccess(user); // type inferred from the `AuthSlice` definition above
      } else {
        api.loginFailure();
      }
    },

    loginFailure: (state) => ({
      user: null,
    }),
    
    loginSuccess: (state, user) => ({
      user,
    }),

    logout: () => async ({ api }) => {
      const success = await auth.logout();

      if (success) {
        api.logoutSuccess();
      }
    },

    logoutSuccess: (state) => ({
      user: null,
    }),
  });
}
```

The first thing to notice here is that we're wrapping `createSlice` with our `createAuthSlice` function, which provides the `auth` HTTP API for us to use. This dependency injection means that our code is portable and testable.

Secondly, we have two types of action here:

1. Reducer actions - these return a new `state` (`loginFailure`, `loginSuccess`, `logoutSuccess`).
2. Side-effect actions - these return a function that accepts `({ api })` and that performs side-effects, which in this case ultimately call reducer actions to update the state.

Notice how clean the code is. Because all the dependencies are injected, and their types are inferred, our code becomes a simple expression of logic. It can be extracted to individual testable functions too, for example like this:

```ts
    ...
    login: (state, email, remember = false) => async ({ api }) => login(api, auth, email, remember),
  });
}

function login(api: AuthApi, authHttp: AuthHttp, email: string, remember?: boolean) {
  const user = await auth.login(email, remember);
  
  if (user) {
    api.loginSuccess(user);
  } else {
    api.loginFailure();
  }
}
```

### Using `merge` to reduce boilerplate and errors

Other than the boilerplate involved with creating actions, the other thing that Redux users often hate is "spread hell":

```ts
{
  ...state,
  nested: {
    ...state.nested: {
    nested: {
      ...state.nested.nested
      nested: payload
      },
    },
  },
},
```

It's really ugly and it's easy to make a mistake. Apart from not having a state that is too nested, one solution to this is to use an immutable `merge` function. RTK chose immer, but this comes with the slightly dirty feeling of modifying function parameters, and I know that many people will be adding `// eslint-disable ...` on every slice/reducer they create.

`crux` provides a different solution, which looks like this:

```ts
import { merge } from '@crux/utils';

type CounterSlice = {
  add: number;
  subtract: number;
}

export const { actions, reducer } = createSlice<CounterSlice>()('counter', initialState, {
  add: (state, num) => merge(state, {
    count: state.count + num
  }),
  subtract: (state, payload) =>  merge(state, {
    count: state.count - num
  }),
});
```

This tidies things up a little, and ensures that all your updates are immutable, even with nested properties. So, instead of this:

```ts
{
  ...state,
  nested: {
    ...state.nested: {
    nested: {
      ...state.nested.nested
      nested: payload
      },
    },
  },
},
```

You can do this:

```ts
merge(state, {
  nested: {
    nested: {
      nested: payload
    },
  },
},)
```