# Crux

## Packages

`crux` uses various libraries, maintained in this repo, and free for you to use in your own projects.

- [async-queue](packages/async-queue/README.md) - a queue utility that waits for queue entry `Promise`s to resolve before running the next
- [di](packages/di/README.md) - a lightweight dependency-injection framework to encourage code decoupling
- [event-emitter](packages/event-emitter/README.md) - a fully-typed event emitter
- [fsm](packages/fsm/README.md) - a simple, no-frills finite state machine
- [redux-router](packages/redux-router/README.md) - a router that hooks into the Redux state
- [router](packages/router/README.md) - a lightweight and decoupled router
- [store](packages/store/README.md) - a framework-agnostic store that provides immutable updates and observers by default
- [sync-queue](packages/sync-queue/README.md) - a synchronous queue utility.

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
