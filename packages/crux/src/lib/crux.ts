import { dynamicStore, DynamicStore } from '@crux/dynamic-store';
import { EventEmitter } from '@crux/event-emitter';
import { Action, Dispatch, MiddlewareAPI } from '@crux/redux-types';
import { Subscription } from './subscription';
import type { Slice, View } from './types';

export interface Options {
  emitter?: EventEmitter<Events>;
  store?: DynamicStore;
}

export type Events<State = any> = {
  afterReducer: { action: Action; state: State };
  afterSlices: { action: Action; state: State };
  afterLayout: { action: Action; state: State };
  afterViews: { action: Action; state: State };
  afterSubscriptions: { action: Action; state: State };
};

export function crux(
  {
    root,
    slices,
    subscriptions = [],
    views,
  }: {
    root?: HTMLElement;
    slices: Slice[];
    subscriptions?: Subscription[];
    views: View[];
  },
  { emitter, store = dynamicStore() }: Options = {}
) {
  if (!root) {
    console.info('No root element provided. Running in headless mode.');
  }

  let initialised = false;

  const middleware = (api: MiddlewareAPI) => (next: Dispatch) => async (action: Action) => {
    next(action);

    // If we handle this action below, it will get into some kind of loop. This action is fired
    // when we call `slice.register(instance.middleware, instance.reducer)`, which happens before
    // layouts, views, and subscriptions are fired, so we don't need to handle it here too.
    if (action.type === '__cruxRegistry/reducer/add') {
      return;
    }

    const state = api.getState();

    emitter?.emit('afterReducer', { action, state });

    /**
     * UPDATE SLICES
     */
    const slicesToRegister: Slice[] = [];

    for (const slice of slices) {
      if (!slice.getStore()) {
        slice.bindStore(store);
      }

      const unregister = slice.getUnregister();
      const shouldBeEnabled = slice.shouldBeEnabled?.(api.getState()) ?? true;

      if (unregister && !shouldBeEnabled) {
        unregister();
      }

      if (!unregister && shouldBeEnabled) {
        // getting a slice instance will register its middleware and reducer
        slicesToRegister.push(slice);
      }
    }

    await Promise.all(slicesToRegister.map((slice) => slice.getInstance()));

    if (!initialised) {
      store.dispatch({ type: '__crux/initialise/end' });
      initialised = true;
    }

    emitter?.emit('afterSlices', { action, state });

    /**
     * LAYOUT
     */
    const layoutView = views.find((view) => view.root === 'root');

    if (!layoutView) {
      throw new Error('No layout view found');
    }

    const layoutRoot = root ?? { id: 'root' };

    await layoutView.render(layoutRoot as HTMLElement, api.getState());

    emitter?.emit('afterLayout', { action, state });

    /**
     * VIEWS
     */
    const viewsToRender: { view: View; root: HTMLElement }[] = [];

    for (const view of views) {
      if (view.root === 'root') {
        continue;
      }

      if (view.root) {
        const viewRoot = document.querySelector(`[data-crux-root=${view.root}]`);

        if (viewRoot) {
          viewsToRender.push({ view, root: viewRoot as HTMLElement });
        }
      }
    }

    const currentState = api.getState();

    await Promise.all(viewsToRender.map(({ view, root }) => view.render(root, currentState)));

    emitter?.emit('afterViews', { action, state });

    /**
     * SUBSCRIPTIONS
     */
    for (const subscription of subscriptions) {
      subscription.runSubscription(api.getState());
    }

    emitter?.emit('afterSubscriptions', { action, state });
  };

  store.addMiddleware(middleware);

  store.dispatch({ type: '__crux/initialise/start' });

  return {
    ...emitter,
    addSlice,
    addSubscription,
    addView,
    store,
  };

  function addTo(arr: Slice[] | View[] | Subscription[], obj: Slice | View | Subscription) {
    arr.push(obj as any);

    return () => {
      const index = arr.indexOf(obj as any);

      if (index > -1) {
        arr.splice(index, 1);
      }
    };
  }

  function addSlice(slice: Slice) {
    addTo(slices, slice);
  }

  function addView(view: View) {
    addTo(views, view);
  }

  function addSubscription(subscription: Subscription) {
    addTo(subscriptions, subscription);
  }
}
