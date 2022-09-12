# redux-slice

## Installation

```bash
npm install --save @crux/redux-slice
```

## `slice`

`slice` is a shorthand way of creating actions, reducers, and side-effects with minimal boilerplate. Normally, Redux leaves the side-effects up to you, and it's often messy, with no clear official direction. `@crux/redux-slice` replaces the need for sagas, and ensures your code is succinct, easy to read, easy to test, and decoupled for maximum longevity.

The one downside to having all this functionality baked-in is that you have to define the parameters of your payloads separately. However, as you'll see, this is a small price to pay. Let's take a look at a simple example that covers all our needs (actions, reducers, and side-effects).

```ts
import { createSlice } from '@crux/redux-slice';

interface CounterState {
  count: number;
}

const initialState: CounterState = { count: 0 };

// This is where we define the payloads for our actions
type CounterSlice = {
  add: number;
  subtract: number;
}

// Note we have to provide the `CounterSlice` so that crux can work out the API. It's an unfortunate limitation of
// TypeScript that we can't infer the type of `api` here. Hopefully future versions will allow this.
export const { actions, middleware, reducer } = createSlice<CounterSlice>()('counter', initialState, {
  add: (state, payload) => merge(state, {
    count: state.count + payload
  }),
  subtract: (state, payload) => merge(state, {
    count: state.count - payload
  }),
  randomAddOrSubtract: (state, payload) => async ({ api }) => {
    const shouldAdd = Math.random() > 0.5;

    if (shouldAdd) {
      api.add(payload);
    } else {
      api.subtract(payload);
    }
  }
};
```

You can then add your reducer and middleware as normal:

```ts
import { middleware, reducer } from 'counter/slice.ts';

configureStore({
  middleware: [middleware],
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

If you need access to the action type (to use in a saga, for example), you can use the `type` property on the action:

```ts
actions.add.type // `counter/add`
```

`createSlice` also returns a handy `api` object (which is what is provided in your async callback above), whereby `dispatch` is called for you. This is great for reducing imports and coupling around your app. If you want to get the type of your API, you can do it like this:

```ts
import { ApiOf } from '@crux/redux-slice';

export type CounterAPI = ApiOf<CounterSlice>;
```

## Using `merge` to reduce boilerplate and errors

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

export const { actions, reducer } = slice({
  add: (state: State, payload: number) => merge(state, {
    count: state.count + payload
  }),
  subtract: (state: State, payload: number) =>  merge(state, {
    count: state.count - payload
  }),
}, { initialState: initial, name: 'counter' });
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