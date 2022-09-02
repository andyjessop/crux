# redux-slice

## Installation

```bash
npm install --save @crux/redux-slice
```

## `slice`

`slice` is a shorthand way of creating actions and reducers, with minimal boilerplate. There is no shorter-hand way of defining a slice than this.

```ts
import { createSlice } from '@crux/redux-slice';

interface State {
  count: number;
}

const initial: State = { count: 0 };

export const { actions, reducer } = slice({
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

Ok, maybe there _is_ a shorter-hand way of doing it. See `Using merge` below.

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

The payload of the action is fully typed, taken from your payload definition in the `createSlice` config. If you need access to the action type (to use in a saga, for example), you can use the `type` property on the action:

```ts
actions.add.type // `counter/add`
```

## Using `merge` to further reduce boilerplate and errors

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