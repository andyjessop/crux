import type * as Container from '../../di/types';
import type { CruxContainer } from '../types';

export interface API<T = {}> {
  update(crux: CruxContainer, services: Container.API<T>): Promise<void> | void;
}

export type Constructor<T = {}> = (
  el: HTMLElement,
  crux: CruxContainer,
  services: Container.API<T>,
) => API<T>;
