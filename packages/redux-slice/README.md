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

export const { actions, getType, reducer } = slice({
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

The payload of the action is fully typed, taken from your payload definition in the `createSlice` config. If you need access to the action type (to use in a saga, for example), you can use the `type` property on the action:

```ts
actions.add.type // `counter/add`
```

