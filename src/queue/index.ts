import type { Queue } from './types';

export function createQueue(autoFlush: boolean = true): Queue.API {
  const entries: Queue.Entry[] = [];
  let flushing = false;

  return {
    add,
    clear,
    flush,
  };

  function add(fn: Function, ...params: any[]): Promise<any> {
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

    if (autoFlush && flushing === false) {
      flush();
    }

    return promise;
  }

  function clear() {
    flushing = false;
    entries.length = 0;
  }

  async function flush(): Promise<any> {
    const entry = entries.shift();

    if (!entry) {
      flushing = false;

      return;
    }

    flushing = true;

    try {
      const result = await entry.fn(...entry.params);
      
      entry.resolve(result);

      return flush();
    } catch (e) {
      entry.reject(e);
    }
  }
}