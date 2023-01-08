import { createEventEmitter } from '@crux/event-emitter';
import { FinalReturnType, ResourceConfig, State } from '../types';
import { Action, Dispatch, MiddlewareAPI } from '@crux/redux-types';
import { createReducer } from './reducer';
import { resource } from './resource';

export function query(reducerId = 'crux') {
  let dispatch: Dispatch;
  let getState: () => any;
  const resources = new Map<string, ReturnType<typeof resource>>();

  return {
    createResource,
    middleware,
    reducer: createReducer({}),
    reducerId,
  };

  function middleware(api: MiddlewareAPI) {
    if (!dispatch || !getState) {
      dispatch = ((action: Action) => {
        return api.dispatch(action);
      }) as Dispatch<Action>;
      getState = api.getState;
    }

    return function withNext(next: Dispatch<Action>) {
      return function handleAction(action: Action): void {
        next(action);
      };
    };
  }

  function createSetState(id: string) {
    return function setState(state: Partial<State<any, any>>, type?: string) {
      return dispatch({
        meta: { id },
        payload: state,
        type: `__cruxQuery${type ? '/' + type : ''}`,
      });
    };
  }

  function createResource<Config extends ResourceConfig>(key: string, config: Config) {
    // Type inference for mutations and their params
    type QueryParams = typeof config['query'] extends (...params: infer R) => any ? R : any[];

    type MutationParams<K extends keyof typeof config['mutations']> =
      typeof config['mutations'][K]['query'] extends (...params: infer R) => any ? R : any[];

    type Mutations = {
      [P in keyof typeof config['mutations']]: (
        ...params: MutationParams<P>
      ) => FinalReturnType<typeof config['mutations'][P]['query']>;
    };

    // To get the data param, first infer from the query. If not, infer from the mutations
    type Data = typeof config['query'] extends (...params: any[]) => Promise<infer R> ? R : any;
    type Err = any;

    return {
      subscribe,
    };

    function subscribe(...params: QueryParams) {
      const id = createResourceId(key, params);
      const emitter = createEventEmitter();

      if (!resources.has(id)) {
        const setResourceState = createSetState(id);

        resources.set(
          id,
          resource({
            fetchFn: config['query'],
            fetchParams: params,
            getState: () => select(getState()),
            keepUnusedDataFor: config.options?.keepUnusedDataFor,
            maxRetryCount: config.options?.maxRetryCount,
            pollingInterval: config.options?.pollingInterval,
            setState: setResourceState,
          })
        );

        setResourceState(
          { data: null, error: null, loading: false, updating: false },
          'resource/init'
        );
      }

      const { addSubscriber, mutate, refetch, removeSubscriber } = resources.get(id) as ReturnType<
        typeof resource
      >;

      addSubscriber();

      if (config.options?.lazy === false) {
        refetch();
      }

      return {
        ...(mapToMutateFunctions() as Mutations),
        ...emitter,
        getState: () => select(getState()),
        refetch,
        select,
        unsubscribe,
      };

      function mapToMutateFunctions() {
        const mutateFunctions = {};

        Object.keys(config.mutations).forEach((key) => {
          mutateFunctions[key] = async function (...params: any[]) {
            return await mutate(config.mutations[key], ...params);
          };
        });

        return mutateFunctions;
      }

      function select(state: unknown): State<Data, Err> | undefined {
        return state[reducerId]?.[id] as State<Data, Err> | undefined;
      }

      function unsubscribe() {
        removeSubscriber();
      }
    }
  }
}

function createResourceId(key: string, params: any[]) {
  return params.length ? `${key}|${params.map((param) => JSON.stringify(param)).join('|')}` : key;
}
