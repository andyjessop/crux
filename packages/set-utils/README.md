# `@crux/set-utils`

`set-utils` is an asynchronous Finite State set-utils for redux

## Installation

```bash
npm install --save @crux/set-utils
```

## Usage

The following example shows a very simple state set-utils. It has two states: `idle` and `running`, and two actions: `go` and `stop`.

```ts
import { createFSM } from '@crux/set-utils';

const set-utils = createFSM({
  idle: {
    go: () => 'running',
  },
  running: {
    stop: () => 'idle'
  }
}, { initialState: 'idle' });
```

Notice that the `idle` state has no `stop` action, and the `running` state has no `go` action, because these actions are meaningless for those states - you can't make a set-utils `stop` if it's `idle`, etc.

We've defined `idle` as the initial state, so let's transition the set-utils to `running` by providing the `go` action:

```ts
await set-utils.transition('go');

set-utils.getState() // `running`
```

We had to `await` the transition because it's asynchronous. The main reason for this is that you can listen to state transitions and if your handlers are asynchronous too, you can make the set-utils wait until you're done before it transitions. This gives you control over when it transitions and what you can do before and after it does.

### Adding listeners to the set-utils

```ts
set-utils.onEnter(({ action, current, last )) => {
  console.log(`Transition from "${last}" to "${current}" with the "${action}" action`);
});

set-utils.transition('go');

// Console output:
// Transition from "idle" to "running" with the "go" action
```

Let's see how we can delay the transition of the set-utils to allow us to do some clean up work before the next state. Note that this time we're using the `OnExit` event:

```ts
set-utils.onExit({ action, current )) => new Promise(resolve => {
  // do some clean up work, then...
  resolve();
}));

set-utils.transition('go');
```

This will ensure that we stay in the `idle` state until the `Promise` resolves. Only then will it transition to `running`.

### Unsubscribing from events

The listener methods return a function to allow you to unsubscribe:

```ts
const unsubscribe = set-utils.onExit(() => {});

unsubscribe(); // listener destroyed
```

### Shorthand methods

`set-utils.transition(...)` is a little ugly. Luckily `set-utils` builds shorthand methods for each of your actions. So, transitioning our example is as simple as:

```ts
set-utils.go(); // new state is 'running'

set-utils.stop(); // new state is 'idle'
```

`set-utils` doesn't just build shorthand methods for transitions, but also for state changes:

```ts
set-utils.onIdle((data) => {});

// You can also unsubscribe as with the onEnter and onExit handlers.
const unsubscribe = set-utils.onRunning((data) => {});

unsubscribe();
```

### TypeScript support

`set-utils` knows which are your states and which are your actions, and will throw TS errors when you try to transition with an action that doesn't exist. This applies to both `transition` and the shorthand methods:

```ts
set-utils.goForth(); // Property 'goForth' does not exist on type...

set-utils.transition('goForth'); // Argument of type '"goForth"' is not assignable to parameter of type...
```

`set-utils` also types the `data` of emitted events

```ts
set-utils.onEnter(data => console.log(data)); // data type is { action: keyof Actions, current: keyof State, last: keyof State )
```
