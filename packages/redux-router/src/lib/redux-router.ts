import { Action, ActionCreator,Dispatch, MiddlewareAPI, Reducer } from '@crux/redux-types';
import { createRouter, Route, Router, RoutesConfig } from '@crux/router';

type ActionCreators = Record<string, ActionCreator>;

enum EventType {
  Navigate = 'router/navigate',
  Navigated = 'router/_navigated',
}

const actions: ActionCreators = {
  navigate: <T>(route: Route<T>)  => {
    return {
      type: EventType.Navigate,
      payload: route
    };
  },
  _navigated: <T>(route: Route<T>) => {
    return {
      type: EventType.Navigated,
      payload: route
    }
  }
}

export interface State<T = any> {
  route: Route<keyof T & string>;
}

export interface ReduxRouter<T extends RoutesConfig<T>> {
  api: {
    navigate: (route: Route<keyof T>) => void
  };
  actions: ActionCreators;
  middleware: (api: MiddlewareAPI) => (next: Dispatch<Action>) => (action: Action) => void;
  reducer: Reducer<State<keyof T | "root" | "notFound">, Action>;
}

export function createReduxRouter<T extends RoutesConfig<T>>(config: RoutesConfig<T>, existingRouter?: Router<T>): ReduxRouter<T> {
  let dispatch: Dispatch;

  const router = existingRouter ?? createRouter(config);

  const currentRoute = router.getCurrentRoute();

  if (!currentRoute) {
    throw new Error('Current route not found');
  }

  const initialState = {
    route: currentRoute,
  };

  const reducer = createReducer(initialState as any);

  return {
    api: {
      navigate: (route: Route<keyof T>) => {
        dispatch(actions['navigate'](route))
      },
    },
    actions,
    middleware: createReduxRouterMiddleware(router),
    reducer,
  }

  function createReduxRouterMiddleware<T>(router: Router<T>) {
    return function withStore(api: MiddlewareAPI) {
      if (!dispatch) {
        dispatch = api.dispatch;
      }

      router.on('routeDidChange', (data) => {
        const current = data.current;
  
        if (current === null) {
          return;
        }
  
        api.dispatch(actions['_navigated'](current));
      })
  
      return function withNext(next: Dispatch<Action>) {
        return function withAction(action: Action) {
          if (action.type.startsWith('router')) {
            switch(action.type) {
              case 'router/navigate':
                router.navigate(action['payload']);
                next(action);
                break;
              default:
                break;
            }
          }
  
          next(action);
        }
      }
    }
  }
}

export function createReducer(initialState: State) {
  return function reducer(state = initialState, action: Action) {
    switch(action.type) {
      case 'router/_navigated':
        return {
          ...state,
          ...{ route: action['payload'] },
        };
      default: return state;
    }
  } 
}