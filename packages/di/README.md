# @crux/di

`@crux/di` is a TypeScript dependency injection container for node and the front-end.

## Installation

```bash
npm install --save @crux/di
```

## Usage

### Creating the container

```ts
import { di } from '@crux/di';

const container = di({
  data: createDataService,
  http: createHTTPService,
});

function createDataService(): Promise<Data> {
  return import('/path/to/data/service').then(mod => mod.default);
}

function createHTTPService(): Promise<HTTP> {
  return import('/path/to/http/service').then(mod => mod.default);
}
```

### Retrieving a service from the container

```ts
const cache = container.get('data')
  .then(dataService => dataService.get('users'));
```

Notice that all services are retrieved asynchronously, which encourages you to dynamically import them to help code splitting in your app. The service has been lazily instantiated.

### Defining dependencies for a service

Your service may well not be standalone. For instance, your data service might depend on the http service. Let's see how you would define that in `@crux/di`.

```ts
const container = di({
  data: [createDataService, 'http'],
  http: createHTTPService
});

function createDataService(http: HTTP): Data {}
```

If required, you can also define a dependency as a singleton:

```ts
const container = di({
  data: [createDataService, { constructor: 'http', singleton: true }],
  http: createHTTPService
});
```

This will ensure that every time you call `container.get('data')` that `createDataService` is provided with a singleton http dependency.
