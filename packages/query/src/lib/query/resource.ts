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
  setState: (state: Partial<State<unknown, unknown>>, type?: string) => void;
}) {
  const queue = createAsyncQueue();
  let isFetching = false;
  let isMutating = false;
  let retryCount = 0;
  let subscriberCount = 0;
  let selfDestructTimeout: ReturnType<typeof setTimeout> | undefined;
  let pollTimeout: ReturnType<typeof setTimeout> | undefined;

  return {
    addSubscriber,
    mutate,
    refetch,
    removeSubscriber,
  };

  function addSubscriber() {
    subscriberCount += 1;

    clearTimeout(selfDestructTimeout);
  }

  async function doFetch() {
    isFetching = true;
    clearTimeout(pollTimeout);

    setState(
      {
        loading: true,
        updating: getState().data !== null,
      },
      'fetch/pending'
    );

    try {
      const result = await fetchFn(...fetchParams);

      setState(
        {
          data: result,
          loading: false,
          updating: false,
        },
        'fetch/fulfilled'
      );

      isFetching = false;

      if (pollingInterval !== null) {
        startPollTimeout();
      }

      queue.flush();

      return result;
    } catch (e) {
      setState(
        {
          error: e,
          loading: false,
          updating: false,
        },
        'fetch/rejected'
      );

      isFetching = false;
      queue.flush();
    }
  }

  async function doMutation(config: MutationConfig, ...params: any[]) {
    isMutating = true;

    const { query, optimistic, options } = config;
    const { refetchOnSuccess } = options ?? { refetchOnSuccess: true };
    const state = getState();

    if (optimistic) {
      const response = optimistic?.(...params);

      const data = isFunction(response) ? response(getState().data) : response;

      setState(
        {
          data,
          loading: true,
          updating: state.data !== null,
        },
        'mutate/optimistic'
      );
    }

    try {
      const result = await query(...params);

      const data = isFunction(result) ? await result(getState().data) : result;

      setState(
        {
          data: refetchOnSuccess === false ? data : state.data,
          loading: false,
          updating: false,
        },
        'mutate/fulfilled'
      );

      isMutating = false;
      retryCount = 0;

      if (refetchOnSuccess) {
        refetch();
      } else {
        queue.flush();
      }

      return data;
    } catch (e) {
      setState(
        {
          error: e,
          loading: false,
          updating: false,
        },
        'mutate/rejected'
      );

      isMutating = false;
      retryCount += 1;

      if (retryCount === maxRetryCount) {
        throw e;
      }

      queue.flush();
    }
  }

  async function mutate<T extends any[]>(config: MutationConfig, ...params: T) {
    if (isFetching) {
      return queue.add(doMutation, config, ...params);
    } else {
      return doMutation(config, ...params);
    }
  }

  function startPollTimeout() {
    pollTimeout = setTimeout(async () => {
      refetch();
    }, pollingInterval * 1000);
  }

  async function refetch() {
    if (isMutating) {
      queue.add(doFetch);
    } else {
      return doFetch();
    }
  }

  async function removeSubscriber() {
    subscriberCount -= 1;

    if (subscriberCount === 0) {
      selfDestructTimeout = setTimeout(async () => {
        clearTimeout(pollTimeout);
        setState(
          {
            data: null,
            error: null,
            loading: false,
            updating: false,
          },
          'self-destruct'
        );
      }, keepUnusedDataFor);
    }
  }
}

function isFunction<D>(
  obj: D | ((data: D | null) => D | null) | null
): obj is (data: D | null) => D | null {
  return typeof (<(data: D) => D>obj) === 'function';
}
