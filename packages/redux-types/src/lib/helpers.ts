import { Action } from './types';

export function isAction(value: unknown): value is Action {
  const anyValue = value as any;

  return (
    anyValue.type &&
    (anyValue.error === true ||
      anyValue.error === false ||
      anyValue.payload !== undefined ||
      anyValue.meta !== undefined)
  );
}
