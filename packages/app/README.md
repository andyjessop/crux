# `@crux/app`

This is the primary way to create a `crux` application. Pass it a configuration object of your services, layout, modules, etc.:

```ts
const core = await createApp({
  modules: {
    router: {
      enabled: () => true,
      factory: () => import('./modules/router/redux').then(mod => mod.createRouterRedux)
    },
    layout: {
      enabled: () => true,
      factory: () => import('./modules/layout/redux').then(mod => mod.createLayoutRedux),
    },
  },
  root,
  services: {
    cache: { factory: () => import('./services/cache').then(mod => mod.createCacheService) },
    darkMode: { factory: () => import('./modules/dark-mode/service').then(mod => mod.createDarkModeService), deps: ['cache'] },
  },
  views: {
    layout: {
      selectData: selectLayout,
      factory: () => import('./modules/layout/views/layout').then(mod => mod.createLayoutView),
    },
  }
}, { logger: createLogger('debug') });
```
There's a lot going on above, let's break it down:

```ts
const core = await createApp({
```

The app constructor is asynchronous.

```ts
  root,
```

The root is an HTMLElement that currently exists in the DOM.

```ts
services: {
  cache: { factory: () => import('./services/cache').then(mod => mod.createCacheService) },
  darkMode: { factory: () => import('./modules/dark-mode/service').then(mod => mod.createDarkModeService), deps: ['cache'] },
},
```

Services are defined as dynamic imports with a `factory`, which is a function that returns a `Promise` of the service constructor function, and an optional `deps` array, which specifies the keys of other services to be injected into the constructor when it is instantiated.

NB: the `services` object defines a `@crux/di` container, which is used internally. See the [`@crux/di` docs](../di/README.md) for more documentation.

Here, we've defined two services, a `cache` service and a `darkMode` service, which makes use of the `cache` service.

```ts
views: {
  layout: {
    selectData: selectLayout,
    factory: () => import('./app/layout/views/layout').then(mod => mod.createLayoutView),
  },
}
```

Views are defined in a similar way to services, except that they can include `selectData` for selecting data from the store, and `selectActions` for selecting registered actions from the store (only non-layout views).

The `layout` view is required. Any other view that is registered also requires a `root`, which is a `data-crux-root` as defined by the layout view:

```ts
views: {
  layout: { ... },
  otherView: {
    root: 'sidebar',
    selectData: selectOtherViewData,
    selectActions: selecOtherViewActions,
    factory: () => import('./features/other/views/other-view').then(mod => mod.createOtherView),
  }
}
```

Modules are also defined in a similar way to views and services, but they also define an `enabled` selector. This enables modules to mount and unmount according to any state-driven criteria.

```ts
modules: {
    router: {
      enabled: (state) => true,
      factory: () => import('./modules/router/redux').then(mod => mod.createRouterRedux)
    },
    layout: {
      enabled: (state) => true,
      factory: () => import('./modules/layout/redux').then(mod => mod.createLayoutRedux),
    },
  },
```
