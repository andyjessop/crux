# Crux

`crux` is a system for building web apps that are designed to be small, fast, and decoupled. It helps you to ensure the code you write is long-lived, low in technical debt, and low in churn.

`crux` is a framework that brings Redux front-and-centre of your app. Rather than "you might not need Redux", `crux` posits that "you might not need React". It allows you to use any view library (even multiple frameworks), and simplifies the rendering of a view such that you will probably opt for a library that is much simpler and less capable (read "smaller and less complex") than React. For example, something like `lit` is a perfect fit.

It's often claimed that testing is a first-class citizen in many front-end frameworks, but this is rarely the case. Testing is usually cumbersome and requires third-party libraries that couple your test code to the framework. I would argue that this is a bad practice for an app with long-term ambition. `crux` approaches things differently - because your views are strictly a pure representation of the state, most of your testing involves testing the state. Not only is this faster, it has better support in your IDE, and is portable to multiple frameworks.

`crux` is a framework that stays out of the way of your code, encouraging it to be truly modular and long-lived.

## Packages

`crux` uses various libraries, maintained in this repo, and free for you to use in your own projects.

- [app](packages/app/README.md) - create a `crux` application
- [async-queue](packages/async-queue/README.md) - a queue utility that waits for queue entry `Promise`s to resolve before running the next
- [di](packages/di/README.md) - a lightweight dependency-injection framework to encourage code decoupling
- [event-emitter](packages/event-emitter/README.md) - a fully-typed event emitter
- [machine](packages/machine/README.md) - a simple, no-frills finite state machine
- [redux-machine](packages/redux-machine/README.md) - a simple, no-frills finite state machine that integrates with a redux slice
- [redux-registry](packages/redux-registry/README.md) - dynamically register/unregister middleware and reducers (for code-splitting)
- [redux-router](packages/redux-router/README.md) - a router that hooks into the Redux state
- [redux-slice](packages/redux-slice/README.md) - an RTK-alternative createSlice that has better typing and a smaller footprint.
- [redux-types](packages/redux-types/README.md) - types for Redux
- [query](packages/query/README.md) - a tiny RTK-alternative
- [router](packages/router/README.md) - a lightweight and decoupled router
- [set-utils](packages/set-utils/README.md) - utilities for working with Sets.
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
npx nx g @nrwl/js:library [name] --buildable
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
