import { machine } from '@crux/machine';
import { createAsyncQueue } from '@crux/async-queue';
import { MutationConfig, State } from '../types';

export function resource({
  fetchFn,
  fetchParams,
  getState,
  keepUnusedDataFor = 60,
  maxRetryCount = 3,
  pollingInterval = 60,
  setState,
}: {
  fetchFn: (...params: any[]) => Promise<any>;
  fetchParams?: unknown[];
  getState: () => State<any, any>;
  keepUnusedDataFor?: number;
  maxRetryCount?: number;
  pollingInterval?: number | null;
  setState: (state: Partial<State<unknown, unknown>>) => void;
}) {
  const queue = createAsyncQueue();

  let retryCount = 0;
  let subscriberCount = 0;
  let selfDestructTimeout: ReturnType<typeof setTimeout> | undefined;
  let pollTimeout: ReturnType<typeof setTimeout> | undefined;

  const config = {
    idle: {
      pollTimeoutStart: () => 'waitingForNextFetch',
      fetch: () => 'fetching',
      forceFetch: () => 'fetching',
      mutate: () => 'mutating',
    },
    fetching: {
      fetchFailure: () => {
        if (retryCount === maxRetryCount) {
          return 'idle';
        }

        retryCount += 1;

        return 'fetching';
      },
      fetchSuccess: () => 'idle',
      selfDestructStart: () => 'selfDestructing',
    },
    selfDestructing: {
      cancelSelfDestruct: () => 'idle',
      selfDestructTimeout: () => 'idle',
    },
    mutating: {
      mutateFailure: () => {
        if (retryCount === maxRetryCount) {
          return 'idle';
        }

        retryCount += 1;

        return 'mutating';
      },
      mutateSuccess: () => 'idle',
    },
    waitingForNextFetch: {
      forceFetch: () => 'fetching',
      mutate: () => 'mutating',
      pollTimeout: () => 'fetching',
    },
  };

  const resourceMachine = machine(config, { initialState: 'idle' });

  resourceMachine.onIdle(() => {
    if (pollingInterval !== null) {
      queue.add(resourceMachine.pollTimeoutStart);
    }

    queue.flush();
  });

  async function doFetch() {
    setState({
      loading: true,
      updating: getState().data !== null,
    });

    try {
      const result = await fetchFn(...fetchParams);

      resourceMachine.fetchSuccess();

      setState({
        data: result,
        loading: false,
        updating: false,
      });

      return result;
    } catch (e) {
      resourceMachine.fetchFailure();

      setState({
        error: e,
        loading: false,
        updating: false,
      });
    }
  }

  resourceMachine.onWaitingForNextFetch(() => {
    pollTimeout = setTimeout(() => {
      resourceMachine.pollTimeout();
    }, pollingInterval);
  });

  resourceMachine.onExit(({ action, current }) => {
    if (current === 'selfDestructing' && action !== 'selfDestructTimeout') {
      clearTimeout(selfDestructTimeout);
    }

    if (current === 'waitingForNextFetch') {
      clearTimeout(pollTimeout);
    }

    if (['fetching', 'mutating'].includes(current)) {
      retryCount = 0;
    }
  });

  return {
    addSubscriber,
    mutate,
    refetch,
    removeSubscriber,
  };

  function addSubscriber() {
    subscriberCount += 1;

    resourceMachine.cancelSelfDestruct();
  }

  async function doMutation(config: MutationConfig, ...params: any[]) {
    const { query, optimistic, options } = config;
    const { refetchOnSuccess } = options;
    const state = getState();

    if (optimistic) {
      const response = optimistic?.(...params);

      const data = isFunction(response) ? response(getState().data) : response;

      setState({
        data,
        loading: true,
        updating: state.data !== null,
      });
    }

    try {
      const result = await query(...params);

      const data = isFunction(result) ? await result(getState().data) : result;

      setState({
        data: config.options.refetchOnSuccess === false ? data : state.data,
        loading: false,
        updating: false,
      });

      resourceMachine.mutateSuccess();

      if (refetchOnSuccess) {
        resourceMachine.fetch();
      }

      return data;
    } catch (e) {
      setState({
        error: e,
        loading: false,
        updating: false,
      });

      resourceMachine.mutateFailure();
    }
  }

  function mutate<T extends any[]>(config: MutationConfig, ...params: T) {
    const nextState = resourceMachine.mutate();

    if (!nextState) {
      return queue.add(doMutation, config, ...params);
    } else {
      return doMutation(config, ...params);
    }
  }

  function refetch(force = false) {
    const nextState = force ? resourceMachine.forceFetch() : resourceMachine.fetch();

    if (!nextState) {
      return null;
    } else {
      return doFetch();
    }
  }

  function removeSubscriber() {
    subscriberCount -= 1;

    if (subscriberCount === 0) {
      resourceMachine.selfDestructStart();

      selfDestructTimeout = setTimeout(() => {
        resourceMachine.selfDestructTimeout();
      }, keepUnusedDataFor);
    }
  }
}

function isFunction<D>(
  obj: D | ((data: D | null) => D | null) | null
): obj is (data: D | null) => D | null {
  return typeof (<(data: D) => D>obj) === 'function';
}
