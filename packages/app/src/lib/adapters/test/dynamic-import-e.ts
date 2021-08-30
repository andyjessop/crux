import type { Model } from '../types';

export function createE(callback?: Function): Model {
  return {
    actions: {
      e: () => 'e',
    },
    destroy: () => callback?.(),
  };
}
