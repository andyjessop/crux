import type { ConstructorCollection } from '../../../lib/di/types';
import { createContainer } from '../../../lib/di';
import type { EventEmitter } from '../../utils';
import type { API, Model } from './types';

/**
 * Adapters are essentially services that have the added capability of 
*/
export function createAdapters<T, U>(
  initialAdapters: ConstructorCollection<T>,
  context: U,
): API<T, U> {
  const adapters = createContainer<T, U>(initialAdapters, context);
  return {
    ...adapters,
    // activate,
    // deactivate,
  };

  // async function activate(name: keyof T): Promise<boolean> {
  //   if (isActive(name)) {
  //     return true;
  //   }

  //   const constructor = constructors.get(name);

  //   if (!constructor) {
  //     return false;
  //   }

  //   const adapter = await constructor(context);

  //   adapters.add(name, adapter);

  //   return true;
  // }

  // async function deactivate(name: keyof T): Promise<boolean> {
  //   if (!isActive(name)) {
  //     return true;
  //   }

  //   const adapter = await adapters.get(name);

  //   if (!adapter) {
  //     return true;
  //   }

  //   adapter.destroy?.();

  //   adapters.remove(name);

  //   return true;
  // }

  // function isActive(name: keyof T) {
  //   return adapters.get(name);
  // }
}

// function registerHooks(hooks: EventEmitter.API, adapterHooks: Model['hooks']) {
//   if (!adapterHooks) {
//     return;
//   }

//   Object.entries(adapterHooks).forEach(([hookName, callback]) => {
//     if (!callback) {
//       return;
//     }

//     const callbacks = typeof callback === 'function' ? [callback] : callback;

//     callbacks.forEach(cb => {
//       hooks.addListener(hookName, cb);
//     });
//   })
// }

// function unregisterHooks(hooks: EventEmitter.API, adapterHooks: Model['hooks']) {
//   if (adapterHooks) {
//     Object.entries(adapterHooks).forEach(([hookName, callback]) => {
//       if (!callback) {
//         return;
//       }

//       const callbacks = typeof callback === 'function' ? [callback] : callback;

//       callbacks.forEach(cb => {
//         hooks.removeListener(hookName, cb);
//       });
//     })
//   }
// }