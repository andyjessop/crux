export interface AsyncQueue {
  add(fn: Function, ...params: unknown[]): Promise<unknown>;
  clear(): void;
  flush(): Promise<unknown>;
}

export interface AsyncQueueEntry {
  fn: Function;
  params: unknown[];
  reject: Function;
  resolve: Function;
}

export function createAsyncQueue(): AsyncQueue {
  const entries: AsyncQueueEntry[] = [];
  let flushing = false;

  return {
    add,
    clear,
    flush,
  };

  function add(fn: Function, ...params: unknown[]): Promise<unknown> {
    let rej: Function = () => {};
    let res: Function = () => {};

    const promise = new Promise((resolve, reject) => {
      res = resolve;
      rej = reject;
    });

    entries.push({
      fn,
      params,
      reject: rej,
      resolve: res,
    });

    return promise;
  }

  function clear() {
    flushing = false;

    entries.length = 0;
  }

  async function flush(): Promise<unknown> {
    if (flushing) {
      return;
    }

    const entry = entries[0];

    if (!entry) {
      return;
    }

    flushing = true;

    try {
      const result = await entry.fn(...entry.params);

      entry.resolve(result);

      entries.shift();

      flushing = false;

      return flush();
    } catch (e) {
      entry.reject(e);
    }
  }
}
