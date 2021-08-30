import type * as Container from '../../di/types';
import type { CruxContainer } from '../types';

export type Mount<T> = (el: HTMLElement, container: Container.API<T>) => void; // eslint-disable-line no-undef

export type Unmount<T> = Mount<T>;

export type View<T> = {
  mount: Mount<T>;
  unmount: Unmount<T>;
};

export type Collection<T> = Map<string, View<T>>;

export type Constructor<T> = (
  crux: CruxContainer,
  container: Container.API<T>,
) => View<T> | Promise<View<T>>;

export type ConstructorCollection<T> = Record<string, Constructor<T>>;
