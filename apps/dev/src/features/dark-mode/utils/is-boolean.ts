export function isBoolean(val: unknown): val is boolean {
  return val === true || val === false;
}