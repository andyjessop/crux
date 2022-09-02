
export function isPlainObject(obj: unknown) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}