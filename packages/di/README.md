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

async function cache() = {
  return import('./cache-service').then(mod => mod.cacheService);
}

const container = di({
  cache: { factory: cache },
});
```

And the service:

```ts
// ./cache-service
export function cacheService() {
  return {
    get: (key: string) => {
      // retrieve key from cache
    },
    set: (key: string, value: unknown) => {
      // set value in cache
    }
  }
}
```

### Retrieving a service from the container

```ts
async function doSomething() {
  const cache = await container.get('cache');

  cache.get('myVal'); // get method is inferred by TypeScript here.
}
```

Notice that all services are retrieved asynchronously, which encourages you to dynamically import them to help code splitting in your app. The service has been lazily instantiated.

### Defining dependencies for a service

Your service may well not be standalone. For instance, your data service might depend on an http service. Let's see how you would define that in `@crux/di`.

The data service itself:

```ts
// ./data-service
export function dataService(http: httpService) {
  return {
    getUsers: () => http.get('/users'),
  }
}
```

Pulling it all together:

```ts
// The dynamic import.
async function data() = {
  return import('./data-service').then(mod => mod.cache);
}

const container = di({
  data: { factory: data, deps: ['http'] }, // 'http' refers to the key of the http service below
  http: { factory: http }
});

// Inside an async function
const data = await container.get('data');

const users = await data.getUsers();
```

Notice that `@crux/di` injected the `http` dependency into the data service when it was instantiated. You can have as many deps as you like and they are injected in order. For example:

```ts
const container = di({
  cache: { factory: cache }
  data: { factory: data, deps: ['http', 'cache'] },
  http: { factory: http }
});
```

Where the data service might now be something like:

```ts
export function dataService(http: httpService, cache: cacheService) {
  return {
    getUsers: () => http.get('/users').then(users => cache.set('users', users)),
  }
}
```

In order to inject a service as a singleton, define a separate service for each that you need:

```ts
const container = di({
  cache: { factory: cache, deps: ['httpCache'] },
  data: { factory: data, deps: ['httpData'] },
  httpCache: { factory: http },
  httpData: { factory: http },
});
```

This will ensure that the `data` service has a unique instance of the `http` service injected into it.
