type AnyFunction = (...args: any[]) => void;

export interface SyncQueue {
  add(fn: AnyFunction, ...params: unknown[]): void;
  flush(): void;
}

export interface SyncQueueEntry {
  fn: AnyFunction;
  params: any[];
}

export function createSyncQueue(): SyncQueue {
  const entries: SyncQueueEntry[] = [];
  let flushing = false;

  return {
    add,
    flush,
  };

  function add(fn: AnyFunction, ...params: unknown[]): void {
    entries.push({
      fn,
      params,
    });
  }

  function flush(): void {
    if (flushing) {
      return;
    }

    const entry = entries.shift();

    if (!entry) {
      flushing = false;

      return;
    }

    flushing = true;

    entry.fn(...entry.params);

    if (entries.length) {
      return flush();
    }
  }
}
