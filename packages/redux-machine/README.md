# `@crux/redux-machine`

`machine` is an asynchronous Finite State Machine for redux. It's fully-typed, with action names and params inferred from your reducer definitions.

## Installation

```bash
npm install --save @crux/redux-machine
```

## Usage

```ts
interface LightSwitchData {
  state: string;
  meta: number;
}

const initialState: LightSwitchData = {
  meta: 0,
  state: 'off'
};

const lightSwitch = {
  off: {
    switchOn: (state: LightSwitchData, payload: number) => ({
      ...state,
      state: 'on',
      meta: payload,
    }),
  },
  on: {
    switchOff: (state: LightSwitchData) => ({
      ...state,
      state: 'off',
    }),
  },
};

const { actions, reducer } = machine('lightSwitch', lightSwitch, initialState);

// Add reducer as `lightSwitch`. Then just dispatch actions:

store.dispatch(actions.switchOn(2)); // switchOn is fully typed (number and type of arguments enforced by TS)

expect(store.getState().lightSwitch).toEqual({
  state: 'on',
  meta: 2
});

store.dispatch(actions.switchOn(1));

expect(store.getState().lightSwitch).toEqual({
  state: 'on',
  meta: 2 // Switch already 'on', so we didn't update here
});

store.dispatch(actions.switchOff(1));

expect(store.getState().lightSwitch).toEqual({
  state: 'off',
  meta: 1 // Switch already 'on', so we didn't update here
});
```
