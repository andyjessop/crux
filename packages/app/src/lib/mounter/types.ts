import type * as Container from '../../di/types';
import type { CruxContainer } from '../types';
import type * as Views from '../views/types';

export interface API {
  run(): Promise<void>;
}

export type Constructor<T> = (
  crux: CruxContainer,
  container: Container.API<T>,
  views: Views.ConstructorCollection<T>,
  selector?: string,
) => API;

export type MountedViews<T> = Map<string, Views.View<T>>;
