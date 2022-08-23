import { slice } from "@crux/redux-slice";

export interface State {
  status: string
}

const initialState: State = {
  status: 'on'
};

export function createToggleButtonRedux() {
  return slice({
    toggle: (state: State) => ({
      ...state,
      status: state.status === 'on' ? 'off' : 'on'
    })
  }, { initialState, name: 'toggleButton' });
}