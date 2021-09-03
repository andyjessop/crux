# `@crux/app`

[WIP]

## Adapters

Adapters are the only components that can hook into crux lifecycle events. Whereas it's `crux`'s job to update the layout and mount the views, it's the job of adapters to notify any services of these events.

Take, for example, the cruxStoreAdapter adapter. When all the views have been mounted, the cruxStore domain needs to be notified so that it can nofity listeners. The adapter, therefore, hooks into the mounted event:

```ts
function createCruxStoreAdapter(store: Store) {
  return {
    hooks: {
      mounted: nofityListeners,
    }
  };
  
  function notifyListeners() {
    store.notify();
  }
}
```

And then in the app root, the cruxStoreAdapter defines the store as a dependency:

```ts
const app = createCrux({
  ...
  adapters: {
    ...
    store: [createCruxStoreAdapters, 'domain.store'],
  },
  ...
});
```

Note that the store module does not need to destroy the hooks listeners - that is handled internally by `crux`.
