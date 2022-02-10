# @crux/router

`@crux/router` is a framework-agnostic, small, fast, TypeScript router for front-end applications.

## Installation

```bash
npm install --save @crux/router
```

## Usage

```ts
import { createRouter } from '@crux/router';

const router = createRouter({
  users: '/users', // example.com/users
  user: '/users/:id', //ex
});
```

This creates a router with two user routes, one for getting a list of users (e.g. users) and one for getting a single user by id (e.g. `users/1`).

### Setting the base route

`createRouter` takes a second parameter, which is a `string` that defaults to `''`. Use this to set your base route:

```ts
const router = createRouter({
  users: '/users',
  user: '/users/:id',
}, 'api/v2');
```

Note that leading and trailing slashes are removed from the base, so any of these are valid: `/api/v2`, `api/v2/`, `/api/v2/`.

### Transitioning between routes

```ts
// Navigate to example.com/users
router.navigate('users');

// Navigate to example.com/users/1
router.navigate('user', { id: 1 });
```

### Reacting to route changes

`@crux/router` emits events during the route transition. Use `router.on(eventType, callback)` to register listeners to those events:

| Event Name         | Description                                                                                  |
|--------------------|----------------------------------------------------------------------------------------------|
| `routeDidChange`    | Runs immediately as soon as the URL changes. This is the time to start page-in transitions. |
| `ready`             | Runs after any Promises returned from the routeDidChange hook have resolved.                |
| `routeChangeFailed` | Runs if there is an error during route transition.                                          |

For example, let's assume we want to add a fadeIn for the new route, and we want to log when each of those animations has happened:

```ts

router.on('routeDidChange', ({ next }) => fadeIn(next));

router.on('ready', () => console.log('Fade in finished'));

function fadeIn() {
  return new Promise(resolve => {
    document.body.classList.add('fadeIn'); // Fades in for 1000ms
    
    // Resolve the promise after 1000ms
    setTimeout(() => resolve(), 1000);
  });
}
```
