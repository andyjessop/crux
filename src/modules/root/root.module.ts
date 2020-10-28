import type { Module } from '../../lib/app/app';

export function createRootModule() {
  return {
    actions: <Actions>{
      showSidebar,
    },
    initialState: <State>{
      sidebar: false
    },
  };

  function showSidebar(show = true) {
    return {
      state: { sidebar: show },
    }
  }
}

interface Actions {
  showSidebar: (show?: boolean) => { state: State }
}

interface State {
  sidebar: boolean;
}