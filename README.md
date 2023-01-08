# Crux

Crux is a framework for building web apps that are designed to be small, fast, and decoupled. It helps you to ensure the code you write is long-lived, low in technical debt, and low in churn.

## Motivation

Recent trends in front-end app development have seen view libraries like React and Vue become more and more powerful. It's often said that React is not a framework, just a library, yet it's clear you can build an entire application from within the React component tree. This power makes the initial stages of app-building very productive (everything's in one place), but with the downside of having code that is tightly-coupled. As apps age, they tend to get messy and difficult to maintain, often culminating in the need for a big rewrite. Not only that but, crucially, they are often hard to test effectively. When business logic is hidden within components, it usually requires framework-specific testing libraries, which leads to slow CI times, and tests that are as tightly-coupled as the code. This is a recipe for a maintainability disaster for an app with long-term ambitions.

The second major issue with modern apps is of course performance. Bundle sizes are huge and the amount of JavaScript that browsers have to parse, compile, has got out of hand. One solution that has been trending is server-side rendering (SSR), which in many cases helps to reduce the bundle size. There are even frameworks that can bring JS bundles down to < 100KB, ensuring snappy loading on the front end. There are trade-offs, however, because SSR is a complex architecture that in-practice needs to be managed by a third-party framework and deploymed with providers who offer NodeJS servers. The upshot of this is vendor lock-in. Which is more, browser APIs are improving all the time, giving native capabilities to web applications - yet server-side rendered code cannot take advantage of this revolution.

## Core Concepts

### Crux is a framework that de-couples your code

Crux promotes code that is highly-decoupled from any framework (including from Crux), is simple to reason about and to change, and is possible to test without framwork-specific testing libraries or patterns. By moving most business logic to the state layer, nearly all logic that requires testing can be contained within agnostic services. This makes testing simple and avoids the requirement for framework-specific testing libraries.

### Crux produces bundles that are tiny, lazy-loading by default, deployable as PWAs

Small-bundle PWAs are still the fastest way to deliver your application. Crux gives you the best chance of keeping your bundle small so that your app can take advantage of modern browser APIs and initial page responses served instantly by a service worker.

Crux core itself is only a few KB, and there are official plugins to provide critical functionaliy like a router and a data cache layer (think RTKQuery or ReactQuery). It's so small, that the initial bundle providing all this critical functionality can be sent over the wire in around 15KB.

### Crux reduces the need for complex view libraries

A common refrain when talking about state management in React is that "you might not need Redux". Redux is seen as a burden, a necessary evil. This mostly comes from its reputation for oppressive boilerplate which - whilst there have been some improvements with RTK - still persist to this day. Smaller alternatives such as Jotai and Zustand have sprup up as antidotes. Redux itself is such a small and simple piece of code (you can write it's equivalent in about 13 lines) that boilerplace is not _inherent_, and can be circumvented with ease. This is what Crux does - it provides all the benefits of Redux (and more!) without any of the boilerplate-related downsides. When you write Crux code, you are writing small, isolated, relevant functions that provide business logic to your app. And very little else.

So Crux _embraces_ Redux, and you are encouraged to put as much logic as possible into your state layer. The general rule of thumb is that if you want to test it, pull it out of your view. You'll quickly find that you have no need for complex logic in your components, nor state, nor effects - you won't use hooks at all. In fact, dare I say it...you might not need React.

With Crux you can use any view library you want, but given that it won't be doing much other than attempting to be the purest representation of state it can possibly be, well you can look for something that's small and light. In our `dev` app you'll see that Web Components are used, as a tiny and standards-based alternative to some of the larger and more popular view frameworks out there.

### Crux is highly modular and supports micro-frontends

In a Crux app, pages are split up into "views" - or you might like to think of them as "widgets". These are small pieces of functionality that are designed to be independent of the rest of the application. They can define their own state slices, their own services, and indeed their own presentation layer.

The layout of the page is independent of these views, and contains no functionality other than to layout the page. It can be built with any view library you like - the only stipulation is that it creates elements with `data-crux-root` attributes, into which Crux will hook the views you have defined. The views, therefore, are not defined in your main component tree, but are completely separate entities that are just mounted onto elements in the page. You can see how this enables a micro-frontend architecture where pages, or parts of pages, are developed independently of the rest of the app.

## Architecture

## Packages

`crux` uses various libraries, maintained in this repo, and free for you to use in your own projects.

## Contributing

### The dev app

The `dev` app is a living app that is desinged to always implement the latest features of `crux`, both as a testing ground for integration tests and as examples of best practices and common patterns.

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
