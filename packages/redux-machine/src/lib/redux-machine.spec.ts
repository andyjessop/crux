import { combineReducers } from '@crux/redux-utils';
import type { Store } from '@crux/redux-types';
import { applyMiddleware, legacy_createStore as createStore } from 'redux';
import { Actions, machine } from './redux-machine';
import thunk from 'redux-thunk';

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

let store: Store;
let actions: Actions<typeof lightSwitch>;

describe('redux-machine', () => {
  beforeEach(() => {
    const { actions: machineActions, reducer: machineReducer } = machine('lightSwitch', lightSwitch, initialState);

    const reducer = combineReducers({ lightSwitch: machineReducer });
    
    store = createStore(reducer, applyMiddleware(thunk));
    actions = machineActions;
  });

  test('switch machine on', () => {
    store.dispatch(actions.switchOn(2));

    expect(store.getState().lightSwitch).toEqual({
      state: 'on',
      meta: 2
    });
  });

  test('cannot switch on if already on', () => {
    store.dispatch(actions.switchOn(2));
    store.dispatch(actions.switchOn(4));

    expect(store.getState().lightSwitch).toEqual({
      state: 'on',
      meta: 2
    });
  });
});
