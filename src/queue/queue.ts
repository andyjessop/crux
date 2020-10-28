export interface API {
  add: (fn: Function, ...params: any[]) => Promise<any>;
  clear: () => void;
  flush: () => Promise<any>;
}

export interface Entry {
  fn: Function;
  params: any[];
  reject: Function;
  resolve: Function;
}

export function createQueue(): API {
  const entries: Entry[] = [];
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

    return promise;
  }

  function clear() {
    flushing = false;
    
    entries.length = 0;
  }

  async function flush(): Promise<any> {
    if (flushing) {
      return;
    }

    const entry = entries[0];

    if (!entry) {
      flushing = false;

      return;
    }

    flushing = true;

    try {
      const result = await entry.fn(...entry.params);
      
      entry.resolve(result);

      entries.shift();

      if (entries.length === 0) {
        flushing = false;
      }

      return flush();
    } catch (e) {
      entry.reject(e);
    }
  }
}