import { createStore, DynamicStore } from '@crux/create-store';
import { EventEmitter } from '@crux/event-emitter';
import { Action, Dispatch, MiddlewareAPI } from '@crux/redux-types';
import { Subscription } from './subscription';
import type { Slice, View } from './types';

export interface Options {
  emitter?: EventEmitter<Events>;
  headless?: boolean;
  store?: DynamicStore;
}

export type Events<State = any> = {
  afterReducer: { action: Action, state: State };
  afterSlices: { action: Action, state: State };
  afterLayout: { action: Action, state: State };
  afterViews: { action: Action, state: State };
  afterSubscriptions: { action: Action, state: State };
}

export function xapp({
  layoutSelector, root, slices, subscriptions, views
}: {
  layoutSelector?: (state: any) => { [key: string]: string },
  root?: HTMLElement;
  slices: Slice[];
  subscriptions: Subscription[];
  views: View[];
}, {
  emitter, headless, store = createStore(),
}: Options = {}) {
  if (!headless) {
    if (!root) {
      throw new Error('Root element is required if not in headless mode.');
    }

    if (!layoutSelector) {
      throw new Error('Layout selector is required if not in headless mode.');
    }
  }
  
  const middleware = (api: MiddlewareAPI) => (next: Dispatch) => async (action: Action) => {
    next(action);

    // If we handle this action below, it will get into some kind of loop. This action is fired
    // when we call `slice.register(instance.middleware, instance.reducer)`, which happens before
    // layouts, views, and subscriptions are fired, so we don't need to handle it here too.
    if (action.type === '__cruxRegistry/ADD_REDUCER') {
      return;
    }

    const state = api.getState();

    emitter?.emit('afterReducer', { action, state });

    /**
     * UPDATE SLICES
     */
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
        const instance = await slice.getInstance();

        slice.register(instance.middleware, instance.reducer);
      }
    }

    emitter?.emit('afterSlices', { action, state });

    /**
     * LAYOUT
     */
    const layouts = layoutSelector?.(api.getState());

    if (!layouts) {
      throw new Error('No layouts found');
    }
    
    const layoutView = views.find(view => view.root === 'root');

    if (!layoutView) {
      throw new Error('No layout view found');
    }

    const layoutRoot = headless ? { id: 'root' } : root;

    await layoutView.render(layoutRoot as HTMLElement, layouts);

    emitter?.emit('afterLayout', { action, state });

    /**
     * VIEWS
     */
    for (const view of views) {
      const shouldRender = Boolean(layouts[view.root]);
      const shouldUpdate = view.updateData(api.getState());

      if (shouldRender && shouldUpdate) {
        const viewRoot = headless ? { id: view.root } : document.querySelector(`data-crux-root=${view.root}`);

        if (!viewRoot) {
          throw new Error(`Could not find root element with data-crux-root=${view.root}`);
        }

        await view.render(viewRoot as HTMLElement, api.getState());
      }
    }

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

  store.dispatch({ type: 'xapp/init' });

  return {
    ...emitter,
    store,
  };
}