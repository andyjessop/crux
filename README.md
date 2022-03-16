# Crux

**NB: `crux` is not yet ready for prime-time. I'm in the process of building out various modules that `crux` will use, and will then pull them all together in a coherent framework. Stay tuned!**

`crux` is a system for building web apps that are designed to be small, fast, and decoupled. It helps you to ensure the code you write is long-lived, low in technical debt, and low in churn.

The central concept is that the core of your application contains your business logic, and is small and lightweight. Components such as the data layer, cache, presentation layer, etc. are all "services" that plug into the core.

`crux` supports micro-frontends by decoupling the layout from the individual views, both of which can be written in any framework and deployed separately.

## Packages

`crux` uses various libraries, maintained in this repo, and free for you to use in your own projects.

- [async-queue](packages/async-queue/README.md) - a queue utility that waits for queue entry `Promise`s to resolve before running the next
- [di](packages/di/README.md) - a lightweight dependency-injection framework to encourage code decoupling
- [event-emitter](packages/event-emitter/README.md) - a fully-typed event emitter
- [fsm](packages/fsm/README.md) - a simple, no-frills finite state machine
- [redux-router](packages/redux-router/README.md) - a router that hooks into the Redux state
- [redux-query](packages/redux-query/README.md) - a tiny RTK-alternative
- [router](packages/router/README.md) - a lightweight and decoupled router
- [store](packages/store/README.md) - a framework-agnostic store that provides immutable updates and observers by default
- [sync-queue](packages/sync-queue/README.md) - a synchronous queue utility.
- [url-parser](packages/url-parser/README.md) - a url parser/generator.

## Contributing

### Running the dev server

```bash
npx nx serve dev
```

### Adding a new package

```bash
npx nx g @nrwl/js:library [name] --buildable --dryRun
```

### Building a package

```bash
npx nx build [name]
```

### Publishing a package

```bash
cd dist/packages/[name]

npm publish --access public
```
