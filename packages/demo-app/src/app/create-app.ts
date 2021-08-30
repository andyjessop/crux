import { createLayout } from './layout';
import { createStoreModule } from './modules/store';
import { createRouterService } from './services/router';
import { createStoreService, Store } from './services/store';
import { createRouter, State } from './domain/router';
import type { Constructor, ConstructorTuple } from 'src/lib/di/types';
import type { Router } from 'src/lib/router';
import type { CruxHooks } from 'src/lib/crux/types';
import { createStore } from './domain/store';
import { createCrux } from 'src/lib/crux';

interface Domain {
  router: {
    navigate(name: string, params: any): void;
  }
  store: Store<State>;
}

interface Services {
  router: Router.API;
  store: Store<State>;
}

interface Modules {
  store: { hooks: (CruxHooks | (() => void))[][]; };
}

type DomainDep = `domain.${string & keyof Domain}`;
type ServiceDep = `services.${string & keyof Services}`;
type CruxLayout = (root: HTMLElement, ...args: any[]) => void

type ModulesConstructors<T> = ConstructorsObj<T, DomainDep>;
type LayoutConstructor = Constructor<CruxLayout> | ConstructorTuple<CruxLayout, DomainDep | { constructor: DomainDep, singleton: true }>;
type DomainConstructors<T> = ConstructorsObj<T, DomainDep | ServiceDep>;
type ServicesConstructors<T> = ConstructorsObj<T, ServiceDep>;

type ConstructorsObj<T, U> = Record<
  keyof T,
  Constructor<T[keyof T]> | ConstructorTuple<T[keyof T], U | { constructor: U, singleton: true }>
>;

type AppConfig<T, V, W> = {
  domain: DomainConstructors<T>,
  el: HTMLElement,
  layout: LayoutConstructor,
  modules: ModulesConstructors<V>,
  services: ServicesConstructors<W>
}

const config: AppConfig<Domain, Modules, Services> = {
  domain: {
    router: [createRouter, 'services.router'],
    store: [createStore, 'services.store'],
  },
  el: <HTMLElement>document.getElementById('#app'),
  layout: [createLayout, 'domain.router'],
  modules: {
    store: [createStoreModule, 'domain.store'],
  },
  services: {
    router: createRouterService,
    store: createStoreService,
  }
}

const app = createCrux(config);