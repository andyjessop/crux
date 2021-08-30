import type * as Container from '../di/types';
import type { Router } from '../router';
import type { EventEmitter } from '../utils';
import type * as Layout from './layout/types';
import type * as Adapters from './adapters/types';
import type * as Views from './views/types';

export interface CruxParams<T, U> {
  adapters?: Container.ConstructorCollection<U>;
  el: HTMLElement;
  layout: Layout.Constructor<T>;
  services?: Container.ConstructorCollection<T>;
  views: Views.ConstructorCollection<T>;
}

export interface Crux extends EventEmitter.API {
  dispatch(moduleName?: string | undefined, action?: string | undefined, data?: any): void;
}

export enum CruxHooks {
  AfterLayout = 'AfterLayout',
  AfterModule = 'AfterModule',
  AfterMounter = 'AfterMounter',
  BeforeLayout = 'BeforeLayout',
  BeforeModule = 'BeforeModule',
  BeforeMounter = 'BeforeMounter',
}