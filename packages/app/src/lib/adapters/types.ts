import type { CruxEvent } from 'src/lib/utils/event-emitter/event-emitter';
import type { CruxHooks } from '../types';
import type { API as ContainerAPI } from '../../di/types';

export interface Model {
  actions?: Record<string, Function>;
  destroy?: () => void;
  hooks?: Partial<Record<CruxHooks, (event: CruxEvent) => any | ((event: CruxEvent) => any)[]>>;
}

export interface API<T, U> extends ContainerAPI<T> {
  // activate(name: keyof T): Promise<boolean>;
  // deactivate(name: keyof T): Promise<boolean>;
}
