import { Layout as LayoutType } from "@crux/core";
import * as ReactDOM from 'react-dom';
import { Region, State } from "../types";
import { Layout } from "./layout";

export function createLayout(): LayoutType<State, Region> {
  return {
    update,
  }

  function update(state: State) {
    const regions = getRegionsFromState(state);

    return {
      regions,
      render,
    }; 

    function render(root: HTMLElement) {
      ReactDOM.render(
        <Layout regions={regions} />,
        root
      );

      return true;
    }
  }
}

function getRegionsFromState(state: State): Region[] {
  return [
    Region.Nav,
    Region.Main,
    state.sidebarIsOpen ? Region.Sidebar : undefined,
  ].filter(entry => entry !== undefined) as Region[];
}