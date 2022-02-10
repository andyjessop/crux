import { AnyAction, Store } from "@reduxjs/toolkit";
import { createSyncQueue } from "@crux/sync-queue";

export function withPauseResume(store: Store) {
  const queue = createSyncQueue();
  let paused = false;

  return {
    ...store,
    dispatch,
    pause,
    resume,
  };

  function dispatch(action: AnyAction) {
    if (paused) {
      queue.add(store.dispatch, action);
    } else {
      store.dispatch(action);
    }
  }

  function pause() {
    paused = true;

    return true;
  }

  function resume() {
    paused = false;
    queue.flush();

    return true;
  }

}