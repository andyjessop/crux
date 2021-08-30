import type * as Container from '../../di/types';
import type { CruxStore } from '../../state';
import type { Model } from './types';
import type { CruxContainer } from '../types';

export function createCruxStoreAdapter<T>(
  crux: CruxContainer,
  services: Container.API<T>,
): Model {
  const hooks = crux.get('hooks');
  const store = <CruxStore<any>>(<unknown>services.get(<keyof T>'store'));

  if (!store) {
    throw new Error('Store service does not exist.');
  }

  hooks.addListener('beforeModule', pauseUpdates);
  hooks.addListener('afterMounter', resumeUpdates);

  return {
    destroy,
  };

  function destroy() {
    hooks?.removeListener('beforeModule', pauseUpdates);
    hooks?.removeListener('afterMounter', resumeUpdates);
  }

  function pauseUpdates() {
    store?.pause();
  }

  function resumeUpdates() {
    store?.resume();
  }
}
