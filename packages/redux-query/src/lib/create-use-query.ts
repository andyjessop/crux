import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Data, Err } from "./create-api";
import { APICall, LoaderConig, Options, ResourceFn, State } from "./types";

export function createUseQuery<
  T extends LoaderConig, Params extends any[], K extends keyof T & string
>(
  resource: ResourceFn<T, Params, Data<T, K>, Err<T, K>>,
  key: K,
  opts: Options<Data<T, K>, Err<T, K>>,
  params: Params,
) {
  const [select, setSelect] = useState<(state: any) => State<Data<T, K>, Err<T, K>>>();
  const [unsubscribe, setUnsubscribe] = useState<() => void>();
  const [fetch, setFetch] = useState<() => void>();
  const [mutations, setMutations] = useState<Record<string, APICall<Data<T, K>, Err<T, K>>>>();

  const state = useSelector(select);

  useEffect(() => {
    resource(key, opts).then(res => {
      const { fetch, mutations, select, unsubscribe } = res.subscribe(...params);

      setSelect(select);
      setUnsubscribe(unsubscribe);
      setFetch(fetch);
      setMutations(mutations);
    });

    return function cleanUp() {
      unsubscribe?.();
    }
  }, [resource, key, opts, unsubscribe]);

  if (!state) {
    return;
  }

  const { data, error, loading, updating } = state;

  return {
    isLoading: loading,
    isUninitialized: !loading && !updating,
    isUpdating: updating,
    error,
    data,
    mutations,
    fetch,
  }
}