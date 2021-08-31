# `@crux/fsm`

`fsm` is an asynchronous Finite State Machine with a simple API.

## Installation

```bash
npm install --save @crux/utils
```

## Usage

The following example shows a very simple state machine. It has two states: `idle` and `running`, and two actions: `go` and `stop`.

```ts
import { fsm } from '@crux/utils';

const machine = fsm({
  idle: {
    go: () => 'running',
  },
  running: {
    stop: () => 'idle'
  }
}, { initialState: 'idle' });
```

Notice that the `idle` state has no `stop` action, and the `running` state has no `go` action, because these actions are meaningless for those states - you can't make a machine `stop` if it's `idle`, etc.

We've defined `idle` as the initial state, so let's transition the machine to `running` by providing the `go` action:

```ts
await machine.transition('go');

machine.getState() // `running`
```

We had to `await` the transition because it's asynchronous. The main reason for this is that you can listen to state transitions and if your handlers are asynchronous too, you can make the machine wait until you're done before it transitions. This gives you control over when it transitions and what you can do before and after it does.

### Adding listeners to the machine

```ts
machine.onEnter(({ action, current, last )) => {
  console.log(`Transition from "${last}" to "${current}" with the "${action}" action`);
});

machine.transition('go');

// Console output:
// Transition from "idle" to "running" with the "go" action
```

Let's see how we can delay the transition of the machine to allow us to do some clean up work before the next state. Note that this time we're using the `OnExit` event:

```ts
machine.onExit({ action, current )) => {
  return new Promise(resolve => {
    // do some clean up work, then...
    resolve();
  })
});

machine.transition('go');
```

This will ensure that we stay in the `idle` state until the `Promise` resolves. Only then will it transition to `running`.

### Unsubscribing from events

The listener methods return a function to allow you to unsubscribe:

```ts
const unsubscribe = machine.onExit(() => {});

unsubscribe(); // listener destroyed
```

### Shorthand methods

`machine.transition(...)` is a little ugly. Luckily `fsm` builds shorthand methods for each of your actions. So, transitioning our example is as simple as:

```ts
machine.go(); // new state is 'running'

machine.stop(); // new state is 'idle'
```

### TypeScript support

`fsm` knows which are your states and which are your actions, and will throw TS errors when you try to transition with an action that doesn't exist. This applies to both `transition` and the shorthand methods:

```ts
machine.goForth(); // Property 'goForth' does not exist on type...

machine.transition('goForth'); // Argument of type '"goForth"' is not assignable to parameter of type...
```

`fsm` also types the `data` of emitted events

```ts
machine.onEnter(data => console.log(data)); // data type is { action: keyof Actions, current: string, last: string )
```
