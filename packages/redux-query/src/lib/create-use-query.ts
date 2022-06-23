import { useCallback, useEffect, useRef, useState } from "react";
import { useStore } from "react-redux";
import { Params, Resource, ResourceConfig, State } from "./types";

/* @refresh reset */

export function createUseResource<T extends ResourceConfig>(resource: Resource<T>) {
  type QueryParams = Params<T['query']>;

  return function useResource(...params: QueryParams) {
    const subscription = useRef(resource.subscribe(...params));
    const store = useStore();
    const [state, setState] = useState<State<any, any>>();

    useEffect(() => {
      setState(subscription.current.select(store.getState()));
    }, []);

    const refetch = useCallback(async () => {
      await subscription.current.refetch();

      setState(subscription.current.select(store.getState()));
    }, [subscription.current]);

    return {
      isLoading: state?.loading,
      isUninitialized: state && !state.loading && !state.updating,
      isUpdating: state?.updating,
      error: state?.error,
      data: state?.data,
      // mutations: subscription.current.mutations,
      // onError: subscription.current.onError,
      // onFetch: subscription.current.onFetch,
      // onSuccess: subscription.current.onSuccess,
      refetch,
    }
  };
}