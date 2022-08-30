 export function debounce<T extends any[], U>(fn: (...props: T) => U, wait: number): ((...args: T) => void) {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: T) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      fn(...args);
    }, wait);
  };
}