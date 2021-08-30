import type { Store } from "src/app/services/store";
import type { Router } from "src/lib/router";
import type { EventEmitter } from "src/lib/utils";
import type { State } from "../router";

export function createStore(store: Store<State>, router: Router.API) {
  router.addListener('transition', setRoute);

  return {
    ...store,
    destroy,
  };

  function destroy() {
    router.removeListener('transition', setRoute);
  }

  function setRoute(event: EventEmitter.Event) {
    const { data } = event;

    store.update({ route: data });

  }
}