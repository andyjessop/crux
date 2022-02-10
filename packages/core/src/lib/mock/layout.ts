import { Layout } from '../core';
import { Region, State } from './types';

export function createMockLayout(): Layout<State, Region> {
  return {
    update,
  }

  function update(state: State) {
    const regions = [
      Region.Nav,
      Region.Main,
      state.sidebarIsOpen ? Region.Sidebar : undefined,
    ].filter(entry => entry !== undefined) as Region[];

    return {
      regions,
      render,
    }; 

    function render() {
      return true
    }
  }
}