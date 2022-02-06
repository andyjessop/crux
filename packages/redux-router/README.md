# @crux/redux-router

`@crux/redux-router` is a lightweight router that hooks into Redux.

## Installation

```bash
npm install --save @crux/redux-router
```

## Usage

### Creating the router

```ts
// ./router.ts
import { createReduxRouter } from '@crux/redux-router';

export const { actions, Link, middleware, reducer } = createReduxRouter({
  users: '/users',
  user: '/users/:id'
});
```

The route patterns are really powerful, see [the tests](../router/src/lib/parser/index.spec.ts) for more examples. Suffice it to say that you can match pretty much any route you can dream up.

### Connecting to the Redux store

The middleware and reducer are required to be hooked into your Redux store. The reducer manages the state, and the middleware connects the router itself to Redux.

```ts
import { configureStore } from '@reduxjs/toolkit';
import { middleware, reducer } from './router';

const store = configureStore({
  reducer: {
    router: routerReducer,
  },
  middleware: [middleware]
});
```

### Navigating to a route

That's all you need to be able to modify the routes from within your app. To navigate to a route, just dispatch the `navigate` action:

```ts
import { actions } from './router';

dispatch(actions.navigate('user', { id: '1' }));

// Route changes to /users/1
```

Or build the action manually:

```ts
import { EventType } from 'redux-router';

dispatch({
  type: EventType.Navigate,
  payload: {
    name: 'user',
    params: { id: '1' }
  }
});
```

You can also use the provided `Link` component:

```ts
import { Link } from './router';

export function App() {
  const user2Route = { name: 'user', params: { id: '2' } };

  return (
    <div>
      ...
      <Link to={user2Route} text="Go to user 2" />
    </div>
  );
}
```

### Responding to state changes

The `redux-router` reducer provides the following state (using the above example with the `id` in the route):

```ts
{
  route: {
    name: string;
    params: { id: string }
  }
}
```

There is no `useParams` or `useLocation` provided by `redux-router` because all this data is available in the state. Just use selectors as you would to retrieve any other slice of state.

For example:

```ts
// ./selectors.ts
import { createSelector } from '@reduxjs/toolkit';
import { State } from '@crux/redux-router';

// Assuming you've named the slice `router`
const selectRouter = (state: { router: State }) => state.router;

export const selectRoute = createSelector(
  selectRouter,
  (router) => router.route
);
```

Then `useSelector` in your component:

```ts
import { useSelector } from 'react-redux';
import { selectRoute } from './selectors';

export function MyComponent() {
  const route = useSelector(selectRoute);

  return (
    <div>
      <div>Current route: {JSON.stringify(route)}</div>
    </div>
  );
}
```
