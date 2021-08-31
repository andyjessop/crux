# Crux

**NB: `crux` is still in alpha at the moment, so in no way should it be used for production as the API is almost certain to change very soon**

`crux` aims to guide you into writing code that is long-lived. This means that the code is:

* easy to change incrementally without losing structure and organisation
* structured in such a way that is logical and re-usable
* easy to test, without complex mocking and highly-coupled specialist testing libraries

`crux` enables the simple integration  "micro-frontends", enabling large codebases to be split into smaller, more manageable, components. Small teams can work independently, allowing them to add code and deploy independently, focussing only on the parts of the site that are relevant to them even if they use different view libraries and patterns.

The key takeaways for crux are:

* it is a Typescript/Javascript web-app framework for the browser,
* it promotes highly-decoupled and long-lived code,
* it does not tie your code to a single view library (e.g. Vue, React),
* it provides simple integration for micro-frontends,
* it lowers your level of technical debt,
* it is fully-featured but is tiny (< 7KB all-in)

## Contributing

### Adding a new package

```bash
yarn nx g @nrwl/workspace:lib [name] --directory=[folder] --buildable --publishable --dryRun
```

### Building a package

```bash
yarn nx build http --prod
```

### Publishing a package

```bash
cd dist/packages/http

npm publish --access public
```
