import type { Router } from 'src/lib/router';
import ReactDOM from 'react-dom';
import type { State } from './domain/router';
import type { Store } from './services/store';

export function createLayout(/* root: HTMLElement, store: Store<State> */) {
  return update;

  function update(root: HTMLElement, store: Store<State>) {
    const route = routeSelector(store.getState());

    ReactDOM.render(<Layout route={route} />, root);
  }
}

function Layout({ route }: { route: Router.RouteParams | null }) {
  return <div>{route?.name || 'Route not yet set'}</div>;
}

function routeSelector(state: State) {
  return state.route;
}