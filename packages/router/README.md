# @crux/router

`@crux/router` is a framework-agnostic, small, fast, TypeScript router for front-end applications.

## Installation

```bash
npm install --save @crux/router
```

## Usage

```ts
import { createRouter } from '@crux/router';

const router = createRouter('', {
  users: '/users',
  user: '/users/:id',
});
```

This creates a router with a base route of `''` (i.e. the root of the domain), and two user routes, one for getting a list of users (e.g. users) and one for getting a single user by id (e.g. `users/1`).

### Transitioning between routes

```ts
// Navigate to /users
router.navigate('users');

// Navigate to /users/1
router.navigate('user', { id: 1 });
```

### Reacting to route changes

`@crux/router` emits events during the route transition. Use `router.on(eventType, callback)` to register listeners to those events:

| Event Name         | Description                                                                                      |
|--------------------|--------------------------------------------------------------------------------------------------|
| `beforeTransition` | Runs before the transition has begun. A great time to do any clean up or start page transitions. |
| `willTransition`   | Runs after any Promises returned from the beforeTransition hook have resolved.                   |
| `didTransition`    | Runs immediately after the URL has changed. This is the time to start page-in transitions.       |
| `afterTransition`  | Runs after any Promises returned from the didTransition hook have resolved                       |

For example, let's assume we want to run a fadeOut for the old route and a fadeIn for the new route, and we want to log when each of those animations has happened:

```ts
router.on('beforeTransition', ({ last }) => fadeOut(last));

router.on('willTransition', () => console.log('Fade out finished'));

router.on('beforeTransition', ({ next }) => fadeIn(next));

router.on('afterTransition', () => console.log('Fade in finished'));

function fadeOut() {
  return new Promise(resolve => {
    document.body.classList.add('fadeOut'); // Fades out for 1000ms
    
    // Resolve the promise after 1000ms
    setTimeout(() => resolve(), 1000);
  });
}

function fadeIn() {
  return new Promise(resolve => {
    document.body.classList.add('fadeIn'); // Fades in for 1000ms
    
    // Resolve the promise after 1000ms
    setTimeout(() => resolve(), 1000);
  });
}
```
